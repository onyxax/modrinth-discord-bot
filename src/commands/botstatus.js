const { SlashCommandBuilder, MessageFlags, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SectionBuilder, ThumbnailBuilder, version } = require('discord.js');
const i18n = require('../services/i18n');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('botstatus')
    .setDescription('Show detailed information about the bot status.'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    const uptimeString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    const memoryUsage = process.memoryUsage();
    const ramUsed = (memoryUsage.heapUsed / 1024 / 1024).toFixed(2);
    const ramTotal = (memoryUsage.heapTotal / 1024 / 1024).toFixed(2);
    const ramRSS = (memoryUsage.rss / 1024 / 1024).toFixed(2);
    const guildCount = interaction.client.guilds.cache.size;
    const userCount = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
    const latency = Math.round(interaction.client.ws.ping);

    const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);

    const section = new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`## ${icons.emoji('barchart3')} ${i18n.t('bot_status_title', userId, guildId)}`),
        new TextDisplayBuilder().setContent(`-# ${interaction.client.user.username} · ${uptimeString}`)
      )
      .setThumbnailAccessory(new ThumbnailBuilder().setURL(interaction.client.user.displayAvatarURL()).setDescription('Bot avatar'));
    container.addSectionComponents(section);
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));

    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${icons.emoji('info')} **${i18n.t('bot_status_uptime', userId, guildId)}** \`${uptimeString}\`  ·  ${icons.emoji('zap')} **${i18n.t('bot_status_latency', userId, guildId)}** \`${latency}ms\`\n` +
        `${icons.emoji('layers')} **${i18n.t('bot_status_ram', userId, guildId)}** \`${ramUsed}MB / ${ramTotal}MB\` (RSS \`${ramRSS}MB\`)`
      )
    );
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${icons.emoji('server')} **${i18n.t('bot_status_servers', userId, guildId)}** \`${guildCount}\`  ·  ${icons.emoji('userround')} **${i18n.t('bot_status_users', userId, guildId)}** \`${userCount}\`\n` +
        `${icons.emoji('globe')} **${i18n.t('bot_status_node', userId, guildId)}** \`${process.version}\`  ·  ${icons.emoji('settings')} **${i18n.t('bot_status_discordjs', userId, guildId)}** \`v${version}\``
      )
    );
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# <t:${Math.floor(Date.now()/1000)}:R>`));

    await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
