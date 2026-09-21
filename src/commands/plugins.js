const createSearchCommand = require('./resourceCommandFactory');

module.exports = createSearchCommand({
  name: 'plugins',
  description: 'Search Minecraft server plugins using Modrinth.',
  projectType: 'plugin',
  includeLoader: true
});
