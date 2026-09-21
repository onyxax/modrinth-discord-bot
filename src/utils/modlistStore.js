const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, '..', 'data', 'modlists.json');

// In-memory cache
let cache = { users: {} };

const ensureStorage = () => {
  if (!fs.existsSync(storagePath)) {
    fs.writeFileSync(storagePath, JSON.stringify({ users: {} }, null, 2), 'utf8');
  }
};

const loadCache = () => {
  ensureStorage();
  try {
    const payload = fs.readFileSync(storagePath, 'utf8');
    cache = JSON.parse(payload);
  } catch (error) {
    console.error('Failed to load modlist cache', error);
    cache = { users: {} };
  }
};

// Initial load
loadCache();

const writeStore = () => {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(cache, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write modlist store', error);
  }
};

const getModlists = (userId) => {
  return cache.users[userId] || {};
};

const saveModlist = (userId, listName, mods) => {
  if (!cache.users[userId]) cache.users[userId] = {};
  cache.users[userId][listName] = mods;
  writeStore();
};

const deleteModlist = (userId, listName) => {
  if (cache.users[userId] && cache.users[userId][listName]) {
    delete cache.users[userId][listName];
    writeStore();
    return true;
  }
  return false;
};

module.exports = {
  getModlists,
  saveModlist,
  deleteModlist
};

