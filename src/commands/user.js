const { SlashCommandBuilder, MessageFlags, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SectionBuilder, ThumbnailBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const modrinthService = require('../services/modrinth');
const i18n = require('../services/i18n');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Search for a Modrinth user/developer.')
    .addStringOption((option) =>
      option
        .setName('username')
        .setDescription('The username or ID of the developer')
        .setRequired(true)
    ),
  async execute(interaction) {
    const username = interaction.options.getString('username', true);
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    await interaction.deferReply();
    try {
      const user = await modrinthService.getUser(username);
      if (!user) {
        return interaction.editReply(`${icons.emoji('x')} ${i18n.t('user_not_found', userId, guildId)}`);
      }
      const projects = await modrinthService.getUserProjects(user.id);
      const totalDownloads = projects.reduce((acc, p) => acc + (p.downloads || 0), 0);

      const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);

      const bio = (user.bio || 'No bio provided.').slice(0, 700);
      const section = new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## ${icons.emoji('userround')} ${user.name || user.username}`),
          new TextDisplayBuilder().setContent(bio)
        );
      if (user.avatar_url) {
        try { section.setThumbnailAccessory(new ThumbnailBuilder().setURL(user.avatar_url).setDescription(user.username)); } catch (_) {}
      }
      container.addSectionComponents(section);
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));

      container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
          `${icons.emoji('package')} **${i18n.t('user_projects', userId, guildId)}** \`${projects.length}\`  ·  ${icons.emoji('userround')} **${i18n.t('user_followers', userId, guildId)}** \`${user.followers || 0}\`\n` +
          `${icons.emoji('clouddownload')} **${i18n.t('user_total_downloads', userId, guildId)}** \`${totalDownloads.toLocaleString()}\`  ·  ${icons.emoji('info')} **${i18n.t('user_joined', userId, guildId)}** \`${new Date(user.created).toLocaleDateString()}\``
        )
      );

      if (projects.length > 0) {
        const topProjects = projects
          .sort((a, b) => b.downloads - a.downloads)
          .slice(0, 5)
          .map(p => `· [${p.title}](https://modrinth.com/${p.project_type}/${p.slug}) — \`${p.downloads.toLocaleString()}\``)
          .join('\n');
        container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('star')} **Top Projects**\n${topProjects}`));
      }

      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel(i18n.t('user_view_on_modrinth', userId, guildId)).setStyle(ButtonStyle.Link).setURL(`https://modrinth.com/user/${user.username}`)
      );
      container.addActionRowComponents(row);
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# @${user.username} · Modrinth`));

      await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    } catch (error) {
      console.error('User command failed:', error);
      await interaction.editReply(`${icons.emoji('x')} ${i18n.t('error_user_failed', userId, guildId)}`);
    }
  }
};
