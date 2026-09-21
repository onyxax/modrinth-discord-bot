const createSearchCommand = require('./resourceCommandFactory');

module.exports = createSearchCommand({
  name: 'mods',
  description: 'Search Minecraft mods using Modrinth.',
  projectType: 'mod',
  includeLoader: true
});
