const { SlashCommandBuilder, MessageFlags, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SectionBuilder, ThumbnailBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const i18n = require('../services/i18n');
const playerStore = require('../utils/playerStore');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skin')
    .setDescription('Display and download a Minecraft player skin.')
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
      const avatarUrl = `https://mc-heads.net/avatar/${username}/100`;
      const bodyUrl = `https://mc-heads.net/body/${username}/left`;
      const downloadUrl = `https://mc-heads.net/download/${username}`;

      const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);

      const section = new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## ${icons.emoji('userround')} ${i18n.t('skin_title', userId, guildId, { username })}`),
          new TextDisplayBuilder().setContent(`-# ${username} · mc-heads.net`)
        )
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(avatarUrl).setDescription(username));
      container.addSectionComponents(section);
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));

      try {
        const gallery = new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(bodyUrl).setDescription(`${username} body`));
        container.addMediaGalleryComponents(gallery);
        container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      } catch (_) {}

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel(i18n.t('skin_download', userId, guildId)).setStyle(ButtonStyle.Link).setURL(downloadUrl)
      );
      container.addActionRowComponents(row);
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${icons.emoji('clouddownload')} Powered by mc-heads.net`));

      await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    } catch (error) {
      console.error('Skin command failed:', error);
      await interaction.editReply(`${icons.emoji('x')} ${i18n.t('error_skin_failed', userId, guildId)}`);
    }
  }
};
