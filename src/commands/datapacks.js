const createSearchCommand = require('./resourceCommandFactory');

module.exports = createSearchCommand({
  name: 'datapacks',
  description: 'Search Minecraft data packs using Modrinth.',
  projectType: 'datapack'
});
