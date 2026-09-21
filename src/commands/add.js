const {
  SlashCommandBuilder,
  MessageFlags,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');
const config = require('../config');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add')
    .setDescription('Get the invite link to add Modrinth Bot (unofficial) to your server.'),
  async execute(interaction) {
    const inviteUrl = `https://discord.com/oauth2/authorize?client_id=${config.clientId}&permissions=8&scope=applications.commands%20bot`;
    const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${icons.emoji('link2')} Invite Modrinth Bot`));
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${icons.emoji('info')} Click the button below to invite Modrinth Bot with the permissions needed to install slash commands and manage itself.`
      )
    );
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('Invite Modrinth Bot').setStyle(ButtonStyle.Link).setURL(inviteUrl)
    );
    container.addActionRowComponents(row);
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Modrinth Bot by Onyxax`));

    try {
      await interaction.reply({
        components: [container],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    } catch (err) {
      console.error('Failed to send add reply:', err);
    }
  }
};
