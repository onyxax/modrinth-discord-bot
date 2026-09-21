const createSearchCommand = require('./resourceCommandFactory');

module.exports = createSearchCommand({
  name: 'resourcepacks',
  description: 'Find resource packs (texture packs) via Modrinth.',
  projectType: 'resourcepack'
});
