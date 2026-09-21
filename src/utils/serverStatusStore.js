const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, '..', 'data', 'servers_history.json');

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
    console.error('Failed to load server status cache', error);
    cache = { guilds: {} };
  }
};

// Initial load
loadCache();

const writeStore = () => {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(cache, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write server status store', error);
  }
};

const addServer = (guildId, address) => {
  if (!cache.guilds[guildId]) cache.guilds[guildId] = [];
  
  if (!cache.guilds[guildId].includes(address)) {
    cache.guilds[guildId].unshift(address);
    // Keep only last 10
    cache.guilds[guildId] = cache.guilds[guildId].slice(0, 10);
    writeStore();
  }
};

const getRecentServers = (guildId) => {
  return cache.guilds[guildId] || [];
};

module.exports = {
  addServer,
  getRecentServers
};

