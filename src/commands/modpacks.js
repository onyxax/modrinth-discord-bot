const createSearchCommand = require('./resourceCommandFactory');

module.exports = createSearchCommand({
  name: 'modpacks',
  description: 'Search Minecraft modpacks using Modrinth.',
  projectType: 'modpack'
});
