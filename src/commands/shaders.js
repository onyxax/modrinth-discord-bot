const createSearchCommand = require('./resourceCommandFactory');

module.exports = createSearchCommand({
  name: 'shaders',
  description: 'Browse shader packs from Modrinth.',
  projectType: 'shader'
});
