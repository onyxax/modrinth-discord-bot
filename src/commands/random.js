const { SlashCommandBuilder, MessageFlags, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder } = require('discord.js');
const modrinthService = require('../services/modrinth');
const { buildResourceContainer } = require('../utils/embedBuilders');
const i18n = require('../services/i18n');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('random')
    .setDescription('Discover a random Minecraft resource!')
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('Type of resource to discover')
        .setRequired(false)
        .addChoices(
          { name: 'Mod', value: 'mod' },
          { name: 'Shader', value: 'shader' },
          { name: 'Resource Pack', value: 'resourcepack' },
          { name: 'Data Pack', value: 'datapack' },
          { name: 'Modpack', value: 'modpack' },
          { name: 'Plugin', value: 'plugin' }
        )
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const type = interaction.options.getString('type') || 'mod';
    try {
      const randomOffset = Math.floor(Math.random() * 200);
      const results = await modrinthService.searchProjects({
        query: '',
        projectType: type,
        size: 20,
        offset: randomOffset
      });
      if (!results.length) {
        return interaction.editReply(`${icons.emoji('x')} ${i18n.t('error_random_not_found', userId, guildId)}`);
      }
      const randomResource = results[Math.floor(Math.random() * results.length)];
      const header = new ContainerBuilder()
        .setAccentColor(theme.ACCENT_COLOR)
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${icons.emoji('dices')} ${i18n.t('random_discovery', interaction.user.id, interaction.guildId)} — ${type}`))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('search')} ${i18n.t('discovery_desc', interaction.user.id, interaction.guildId)}`))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));

      const resourceContainer = buildResourceContainer(randomResource, interaction.user.id, interaction.guildId);

      await interaction.editReply({
        components: [header, resourceContainer],
        flags: MessageFlags.IsComponentsV2
      });
    } catch (error) {
      console.error('Random command failed:', error);
      await interaction.editReply(`${icons.emoji('x')} ${i18n.t('error_random_failed', userId, guildId)}`);
    }
  }
};
