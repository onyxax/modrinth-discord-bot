const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, '..', 'data', 'server.json');

// In-memory cache
let cache = { guilds: [] };

const ensureStorage = () => {
  if (!fs.existsSync(storagePath)) {
    fs.writeFileSync(storagePath, JSON.stringify({ guilds: [] }, null, 2), 'utf8');
  }
};

const loadCache = () => {
  ensureStorage();
  try {
    const payload = fs.readFileSync(storagePath, 'utf8');
    cache = JSON.parse(payload);
  } catch (error) {
    console.error('Failed to load server store cache', error);
    cache = { guilds: [] };
  }
};

// Initial load
loadCache();

const writeStore = () => {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(cache, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write server store', error);
  }
};

const addGuild = (id, name) => {
  if (!cache.guilds.some((guild) => guild.id === id)) {
    cache.guilds.push({ id, name });
    writeStore();
  }
  return cache.guilds;
};

const removeGuild = (id) => {
  const filtered = cache.guilds.filter((guild) => guild.id !== id);
  if (filtered.length !== cache.guilds.length) {
    cache.guilds = filtered;
    writeStore();
  }
  return filtered;
};

const getCount = () => {
  return cache.guilds.length;
};

module.exports = {
  addGuild,
  removeGuild,
  getCount
};

