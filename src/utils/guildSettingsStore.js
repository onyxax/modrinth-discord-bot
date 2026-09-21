const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, '..', 'data', 'guild_settings.json');

// In-memory cache
let cache = { guilds: {} };

const ensureStorage = () => {
  if (!fs.existsSync(storagePath)) {
    fs.writeFileSync(storagePath, JSON.stringify({ guilds: {} }, null, 2), 'utf8');
  }
};

const loadCache = () => {
  ensureStorage();
  try {
    const payload = fs.readFileSync(storagePath, 'utf8');
    cache = JSON.parse(payload);
  } catch (error) {
    console.error('Failed to load guild settings cache', error);
    cache = { guilds: {} };
  }
};

// Initial load
loadCache();

const writeStore = () => {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(cache, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write guild settings store', error);
  }
};

const getSetting = (guildId, key, defaultValue) => {
  if (cache.guilds[guildId] && cache.guilds[guildId][key] !== undefined) {
    return cache.guilds[guildId][key];
  }
  return defaultValue;
};

const setSetting = (guildId, key, value) => {
  if (!cache.guilds[guildId]) cache.guilds[guildId] = {};
  cache.guilds[guildId][key] = value;
  writeStore();
};

module.exports = {
  getSetting,
  setSetting
};

