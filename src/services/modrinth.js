const axios = require('axios');
const config = require('../config');

const client = axios.create({
  baseURL: config.modrinthBaseUrl,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${config.modrinthToken}`,
    'User-Agent': config.modrinthUserAgent,
    'Content-Type': 'application/json'
  }
});

const versionCache = new Map();

const fetchVersionDetails = async (versionId) => {
  if (!versionId) return null;
  if (versionCache.has(versionId)) {
    return versionCache.get(versionId);
  }

  try {
    const { data } = await client.get(`/version/${versionId}`);
    versionCache.set(versionId, data);
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.warn(`Modrinth version ${versionId} not found; skipping details.`);
      return null;
    }
    throw error;
  }
};

const buildModrinthResource = async (project) => {
  if (!project) return null;

  const version = await fetchVersionDetails(project.latest_version);
  const file = version?.files?.[0];
  const projectType = project.project_type || 'project';
  const baseUrl = `https://modrinth.com/${projectType}/${project.slug}`;

  return {
    id: project.id || project.project_id,
    name: project.title || project.slug || 'Modrinth Resource',
    description: project.description || 'No description provided.',
    platform: 'Modrinth',
    projectType,
    author: project.author || project.author_id || null,
    updated: version?.date_published || project.date_modified || project.date_created || null,
    categories: project.categories || project.display_categories || [],
    follows: project.follows || 0,
    downloads: project.download_count || project.downloads || project.downloads || 0,
    gameVersions: version?.game_versions || project.game_versions || project.versions || [],
    icon: project.icon_url,
    url: baseUrl,
    downloadUrl: file?.url,
    sourceVersionId: version?.id,
    slug: project.slug,
    gallery: project.gallery || []
  };
};

const searchProjects = async (
  { query, projectType, version, loader, slug, size = 5, offset = 0, skipDetails = false, timeout } = {}
) => {
  if (!query && !slug && !projectType) return [];

  const facets = [];
  if (projectType) facets.push([`project_type:${projectType}`]);
  if (version) facets.push([`versions:${version}`]);
  if (loader) facets.push([`categories:${loader}`]);
  if (slug) facets.push([`slug:${slug}`]);

  const params = {
    query: slug || query || '',
    size: size.toString(),
    offset: offset.toString()
  };
  if (facets.length) {
    params.facets = JSON.stringify(facets);
  }

  const response = await client.get('/search', { 
    params,
    ...(timeout && { timeout }) 
  });
  const hits = response?.data?.hits || [];
  
  if (skipDetails) {
    return hits.map(hit => ({
      name: hit.title || hit.slug,
      slug: hit.slug,
      platform: 'Modrinth'
    }));
  }

  const results = await Promise.all(hits.map(buildModrinthResource));
  return results.filter(Boolean).slice(0, size);
};



const getUser = async (usernameOrId) => {
  try {
    const { data } = await client.get(`/user/${usernameOrId}`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) return null;
    throw error;
  }
};

const getUserProjects = async (usernameOrId) => {
  try {
    const { data } = await client.get(`/user/${usernameOrId}/projects`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) return [];
    throw error;
  }
};

const getProjectVersions = async (projectSlugOrId) => {
  try {
    const { data } = await client.get(`/project/${projectSlugOrId}/version`);
    return data;
  } catch (error) {
    if (error.response?.status === 404) return [];
    throw error;
  }
};

module.exports = {
  searchProjects,
  getUser,
  getUserProjects,
  getProjectVersions
};

