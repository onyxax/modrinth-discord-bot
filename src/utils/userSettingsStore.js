const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, '..', 'data', 'user_settings.json');

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
    console.error('Failed to load user settings cache', error);
    cache = { users: {} };
  }
};

// Initial load
loadCache();

const writeStore = () => {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(cache, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write user settings store', error);
  }
};

const getSetting = (userId, key, defaultValue) => {
  if (cache.users[userId] && cache.users[userId][key] !== undefined) {
    return cache.users[userId][key];
  }
  return defaultValue;
};

const setSetting = (userId, key, value) => {
  if (!cache.users[userId]) cache.users[userId] = {};
  cache.users[userId][key] = value;
  writeStore();
};

module.exports = {
  getSetting,
  setSetting
};

