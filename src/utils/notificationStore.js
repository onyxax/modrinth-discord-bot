const fs = require('fs');
const path = require('path');

const storagePath = path.join(__dirname, '..', 'data', 'notifications.json');

// In-memory cache
// Structure: { users: { userId: { projectSlug: { lastVersionId, name } } } }
let cache = { users: {} };

const ensureStorage = () => {
  const dir = path.dirname(storagePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
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
    console.error('Failed to load notification cache', error);
    cache = { users: {} };
  }
};

// Initial load
loadCache();

const writeStore = () => {
  try {
    fs.writeFileSync(storagePath, JSON.stringify(cache, null, 2), 'utf8');
  } catch (error) {
    console.error('Failed to write notification store', error);
  }
};

const addNotification = (userId, projectSlug, projectName, lastVersionId) => {
  if (!cache.users[userId]) cache.users[userId] = {};
  cache.users[userId][projectSlug] = { lastVersionId, name: projectName };
  writeStore();
};

const removeNotification = (userId, projectSlug) => {
  if (cache.users[userId] && cache.users[userId][projectSlug]) {
    delete cache.users[userId][projectSlug];
    if (Object.keys(cache.users[userId]).length === 0) {
      delete cache.users[userId];
    }
    writeStore();
    return true;
  }
  return false;
};

const getUserNotifications = (userId) => {
  return cache.users[userId] || {};
};

const getAllUsers = () => {
  return Object.keys(cache.users);
};

const updateLastVersion = (userId, projectSlug, versionId) => {
  if (cache.users[userId] && cache.users[userId][projectSlug]) {
    cache.users[userId][projectSlug].lastVersionId = versionId;
    writeStore();
  }
};

module.exports = {
  addNotification,
  removeNotification,
  getUserNotifications,
  getAllUsers,
  updateLastVersion
};
