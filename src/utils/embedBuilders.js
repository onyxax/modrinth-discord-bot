const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SectionBuilder, ThumbnailBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder } = require('discord.js');
const i18n = require('../services/i18n');
const theme = require('./theme');
const icons = require('./icons');

const RESOURCE_ICONS = {
  mod: icons.emoji('puzzle'),
  modpack: icons.emoji('package'),
  resourcepack: icons.emoji('paintbrush'),
  shader: icons.emoji('sparkles'),
  datapack: icons.emoji('folder'),
  plugin: icons.emoji('plug-2'),
  project: icons.emoji('search')
};

const limitText = (value = '', max = 220, userId = null, guildId = null) => {
  if (!value) return i18n.t('resource_no_desc', userId, guildId);
  if (value.length <= max) return value;
  return `${value.slice(0, max - 3)}...`;
};

const formatDownloads = (value) => {
  if (typeof value === 'number') return value.toLocaleString();
  if (value) return value.toString();
  return 'N/A';
};

const summarizeGameVersions = (versions = []) => {
  if (!versions.length) return 'N/A';
  const defaultLabel = 'N/A';
  const versionGroups = new Map();
  const fallback = [];
  versions.forEach((ver) => {
    const cleaned = ver.trim();
    const match = cleaned.match(/^(\d+)\.(\d+)/);
    const snapshotMatch = cleaned.match(/^(\d+w)/);
    if (match) {
      const key = `${match[1]}.${match[2]}`;
      const values = versionGroups.get(key) || [];
      values.push(cleaned);
      versionGroups.set(key, values);
    } else if (snapshotMatch) {
      const key = snapshotMatch[1];
      const values = versionGroups.get(key) || [];
      values.push(cleaned);
      versionGroups.set(key, values);
    } else if (cleaned) {
      fallback.push(cleaned);
    }
  });
  const orderedKeys = [...versionGroups.keys()].sort((a, b) => {
    if (a.includes('.') && b.includes('.')) {
      const [aMajor, aMinor] = a.split('.').map(Number);
      const [bMajor, bMinor] = b.split('.').map(Number);
      if (bMajor === aMajor) return (bMinor || 0) - (aMinor || 0);
      return (bMajor || 0) - (aMajor || 0);
    }
    if (a.endsWith('w') && b.endsWith('w')) return parseInt(b) - parseInt(a);
    return b.localeCompare(a);
  });
  const summary = [...orderedKeys].map((key) => {
    const collected = [...new Set(versionGroups.get(key))];
    if (collected.length > 1) return `${key}.x`;
    const single = collected[0];
    if (key.includes('.')) return single?.split('.').length > 2 ? single : `${key}.x`;
    return single;
  });
  if (!summary.length && !fallback.length) return defaultLabel;
  return [...summary, ...fallback].join(', ') || defaultLabel;
};

// --- Components V2: الحاوية العريضة الموحدة — صورتان كبيرتان + مصغرة صغيرة بالأعلى ---
const buildResourceContainer = (resource, userId = null, guildId = null) => {
  const description = limitText(resource.description, 220, userId, guildId);
  const downloads = formatDownloads(resource.downloads);
  const versions = summarizeGameVersions(resource.gameVersions);
  const platform = resource.platform || 'Modrinth';
  const url = resource.url;
  const downloadUrl = resource.downloadUrl;

  const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);

  const typeIcon = RESOURCE_ICONS[resource.projectType] || RESOURCE_ICONS.project;

  // 1. العنوان مع الصورة المصغرة الصغيرة بالأعلى — مع الاسم والشعبية والفئات (3 أسطر داخل نفس Section لتوفير المكونات)
  const authorName = resource.author || 'Unknown';
  let updatedTag = '';
  if (resource.updated) {
    try {
      const ts = Math.floor(new Date(resource.updated).getTime() / 1000);
      if (!isNaN(ts)) updatedTag = ` · ${icons.emoji('info')} Updated <t:${ts}:R>`;
    } catch (_) {}
  }
  const followsText = resource.follows ? `${icons.emoji('star')} \`${formatDownloads(resource.follows)}\`` : '';
  const categories = Array.isArray(resource.categories) ? resource.categories.slice(0, 3).join(' · ') : '';
  const categoriesText = categories ? `${followsText ? ' · ' : ''}${icons.emoji('palette')} \`${categories}\`` : '';
  const popularityLine = followsText || categoriesText ? `${followsText}${categoriesText}` : null;

  const titleSection = new SectionBuilder()
    .addTextDisplayComponents(
      new TextDisplayBuilder().setContent(`## ${typeIcon} ${resource.name}`),
      new TextDisplayBuilder().setContent(`-# ${icons.emoji('userround')} by **${authorName}**${updatedTag}`)
    );
  if (popularityLine) {
    titleSection.addTextDisplayComponents(new TextDisplayBuilder().setContent(popularityLine));
  }
  if (resource.icon) {
    try {
      titleSection.setThumbnailAccessory(new ThumbnailBuilder().setURL(resource.icon).setDescription(resource.name));
    } catch (_) {}
  }
  container.addSectionComponents(titleSection);

  container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));

  // 2. الوصف — بدون عنوان (حسب الطلب) — أيقونة مختلفة عن Updated لتجنب التكرار
  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(`${description}\n-# ${icons.emoji('link2')} ${i18n.t('resource_source', userId, guildId)} · ${platform} — [Modrinth](${url})`)
  );

  container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));

  // 3. التفاصيل
  const statsLine = `${icons.emoji('clouddownload')} **${i18n.t('resource_downloads', userId, guildId)}** \`${downloads}\`  ·  ${icons.emoji('layers')} **${i18n.t('resource_versions', userId, guildId)}** \`${versions}\`  ·  ${icons.emoji('globe')} **${i18n.t('resource_platform', userId, guildId)}** \`${platform}\``;

  container.addTextDisplayComponents(
    new TextDisplayBuilder().setContent(statsLine)
  );

  container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));

  // 3. معرض الصور — صورتان كبيرتان
  const galleryItems = [];
  if (Array.isArray(resource.gallery)) {
    for (const g of resource.gallery) {
      if (g && g !== resource.icon) galleryItems.push(g);
      if (galleryItems.length >= 2) break;
    }
  }
  if (galleryItems.length > 0) {
    try {
      const gallery = new MediaGalleryBuilder();
      galleryItems.forEach((u, idx) => {
        gallery.addItems(new MediaGalleryItemBuilder().setURL(u).setDescription(`${resource.name} ${idx + 1}`));
      });
      container.addMediaGalleryComponents(gallery);
    } catch (_) {}
  }

  // 4. الأزرار داخل الحاوية
  const row = new ActionRowBuilder();
  if (downloadUrl) {
    row.addComponents(new ButtonBuilder().setLabel(i18n.t('resource_btn_download', userId, guildId)).setStyle(ButtonStyle.Link).setURL(downloadUrl));
  }
  if (url) {
    row.addComponents(new ButtonBuilder().setLabel(i18n.t('resource_btn_open', userId, guildId)).setStyle(ButtonStyle.Link).setURL(url));
  }
  if (row.components.length) {
    container.addActionRowComponents(row);
  }

  return container;
};

// توافق قديم (لم يعد مستخدمًا لكنه باقٍ للرجوع)
const buildResourceEmbed = (resource, index = 0, userId = null, guildId = null) => {
  return buildResourceContainer(resource, userId, guildId);
};

const buildActionRow = (resource, userId = null, guildId = null) => {
  if (!resource?.downloadUrl && !resource?.url) return null;
  const row = new ActionRowBuilder();
  if (resource.downloadUrl) row.addComponents(new ButtonBuilder().setLabel(i18n.t('resource_btn_download', userId, guildId)).setStyle(ButtonStyle.Link).setURL(resource.downloadUrl));
  if (resource.url) row.addComponents(new ButtonBuilder().setLabel(i18n.t('resource_btn_open', userId, guildId)).setStyle(ButtonStyle.Link).setURL(resource.url));
  return row.components.length ? row : null;
};

module.exports = {
  buildResourceEmbed,
  buildResourceContainer,
  buildActionRow,
  summarizeGameVersions
};
