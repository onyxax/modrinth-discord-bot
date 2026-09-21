const fs = require('fs');
const path = require('path');
const guildSettingsStore = require('../utils/guildSettingsStore');
const userSettingsStore = require('../utils/userSettingsStore');

const localesPath = path.join(__dirname, '..', 'locales');
const locales = {};

// Load all locales
const loadLocales = () => {
  if (!fs.existsSync(localesPath)) return;
  const files = fs.readdirSync(localesPath).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const lang = file.replace('.json', '');
    locales[lang] = JSON.parse(fs.readFileSync(path.join(localesPath, file), 'utf8'));
  }
};

loadLocales();

const t = (key, userId = null, guildId = null, replacements = {}) => {
  let lang = 'en';
  
  if (userId) {
    lang = userSettingsStore.getSetting(userId, 'language', null);
  }
  
  if (!lang && guildId) {
    lang = guildSettingsStore.getSetting(guildId, 'language', 'en');
  }
  
  if (!lang) lang = 'en';

  const locale = locales[lang] || locales['en'] || {};
  
  // Basic key lookup
  let text = locale[key] || locales['en']?.[key] || key;

  // Handle replacements
  if (replacements && typeof replacements === 'object') {
    Object.keys(replacements).forEach((placeholder) => {
      text = text.replace(new RegExp(`{${placeholder}}`, 'g'), replacements[placeholder]);
    });
  }

  return text;
};

module.exports = {
  t,
  availableLanguages: Object.keys(locales)
};
