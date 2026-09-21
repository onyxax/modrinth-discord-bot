const { SlashCommandBuilder, MessageFlags, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SectionBuilder, ThumbnailBuilder } = require('discord.js');
const axios = require('axios');
const i18n = require('../services/i18n');
const playerStore = require('../utils/playerStore');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

const formatTier = (tier, pos) => {
  if (!tier) return 'N/A';
  if (tier === 1) return 'Tier 1';
  const prefix = pos === 0 ? 'HT' : 'LT';
  return `${prefix}${tier}`;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rank')
    .setDescription('Check a player\'s PVP tiers and rankings from MCTiers.')
    .addStringOption((option) =>
      option
        .setName('username')
        .setDescription('The Minecraft username')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const choices = playerStore.getPlayers(focusedValue);
    await interaction.respond(choices.map(p => ({ name: p, value: p })));
  },
  async execute(interaction) {
    const username = interaction.options.getString('username', true);
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    await interaction.deferReply();
    playerStore.addPlayer(username);
    try {
      const { data: profile } = await axios.get(`https://mctiers.com/api/v2/profile/by-name/${username}`, { timeout: 5000 });
      if (!profile || !profile.name) {
        return interaction.editReply(`${icons.emoji('x')} ${i18n.t('user_not_found', userId, guildId)}`);
      }

      const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);

      const section = new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## ${icons.emoji('shield')} ${profile.name.toUpperCase()} — MCTIERS`),
          new TextDisplayBuilder().setContent(`${icons.emoji('star')} ${i18n.t('rank_overall', userId, guildId)} \`#${profile.overall || 'N/A'}\`  ·  ${icons.emoji('zap')} ${i18n.t('rank_points', userId, guildId)} \`${profile.points || 0}\`  ·  ${icons.emoji('globe')} ${i18n.t('rank_region', userId, guildId)} \`${profile.region || 'N/A'}\``)
        )
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(`https://mc-heads.net/body/${profile.name}/left`).setDescription(profile.name));
      container.addSectionComponents(section);
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));

      if (profile.rankings && Object.keys(profile.rankings).length > 0) {
        const lines = Object.entries(profile.rankings).map(([mode, data]) => {
          const modeName = mode.charAt(0).toUpperCase() + mode.slice(1);
          const displayTier = data.retired ? (data.peak_tier || data.tier) : data.tier;
          const displayPos = data.retired ? (data.peak_pos || data.pos) : data.pos;
          const tierStr = formatTier(displayTier, displayPos);
          const retiredLabel = data.retired ? ` (${i18n.t('rank_retired', userId, guildId)})` : '';
          return `${icons.emoji('shield')} **${modeName}** — \`${tierStr}\`${retiredLabel}`;
        }).join('\n');
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('star')} **${i18n.t('rank_tiers', userId, guildId)}**\n${lines}`));
        container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      }

      if (profile.badges && profile.badges.length > 0) {
        const badges = profile.badges.map(b => `${icons.emoji('star')} **${b.title}** — ${b.desc}`).join('\n');
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('info')} **${i18n.t('rank_badges', userId, guildId)}**\n${badges}`));
        container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      }

      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# [mctiers.com/player/${profile.name}](https://mctiers.com/player/${profile.name})`));

      await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    } catch (error) {
      if (error.response?.status === 404) {
        return interaction.editReply(`${icons.emoji('x')} ${i18n.t('user_not_found', userId, guildId)}`);
      }
      console.error('Rank command failed:', error);
      await interaction.editReply(`${icons.emoji('x')} ${i18n.t('error_rank_failed', userId, guildId)}`);
    }
  }
};
