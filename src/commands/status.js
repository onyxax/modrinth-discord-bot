const { SlashCommandBuilder, MessageFlags, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SectionBuilder, ThumbnailBuilder } = require('discord.js');
const axios = require('axios');
const serverStatusStore = require('../utils/serverStatusStore');
const i18n = require('../services/i18n');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

const POPULAR_SERVERS = [
  'hypixel.net',
  'donutsmp.net',
  '2b2t.org',
  'play.wynncraft.com',
  'complexgaming.net',
  'mc.manacube.com',
  'play.cubecraft.net',
  'mccentral.org',
  'pika-network.net',
  'herobrine.org'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('status')
    .setDescription('Check the status of a Minecraft server.')
    .addStringOption((option) =>
      option
        .setName('address')
        .setDescription('The server IP or address (e.g. hypixel.net)')
        .setRequired(true)
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused();
    const recent = serverStatusStore.getRecentServers(interaction.guildId);
    const choices = [...new Set([...recent, ...POPULAR_SERVERS])];
    const filtered = choices.filter(choice => choice.toLowerCase().includes(focusedValue.toLowerCase())).slice(0, 25);
    try {
      await interaction.respond(filtered.map(choice => ({ name: choice, value: choice })));
    } catch (err) {
      console.error('Failed to respond to autocomplete interaction:', err);
    }
  },
  async execute(interaction) {
    await interaction.deferReply();
    const address = interaction.options.getString('address', true);
    const guildId = interaction.guildId;
    const userId = interaction.user.id;
    const fetchStatus = async (url) => {
      try {
        const res = await axios.get(url, { timeout: 10000 });
        return res.data;
      } catch (e) {
        return null;
      }
    };
    try {
      let data = await fetchStatus(`https://api.mcsrvstat.us/3/${address}`);
      if (!data || !data.online) {
        console.log(`Primary API failed for ${address}, trying fallback...`);
        const fallbackData = await fetchStatus(`https://api.minetools.eu/ping/${address}`);
        if (fallbackData && !fallbackData.error) {
          data = {
            online: true,
            version: fallbackData.version?.name,
            players: { online: fallbackData.players?.online, max: fallbackData.players?.max },
            motd: { clean: [fallbackData.description] },
            software: 'Unknown (Fallback)',
            port: 25565,
            hostname: address
          };
        }
      }
      if (!data || !data.online) {
        return interaction.editReply(`**${address}** ${i18n.t('status_offline', userId, guildId)}.`);
      }
      serverStatusStore.addServer(guildId, address);

      const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);

      // عنوان مع أيقونة
      const iconUrl = `https://api.mcsrvstat.us/icon/${address}`;
      const section = new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## ${icons.emoji('server')} ${address}`),
          new TextDisplayBuilder().setContent(`${icons.emoji('circle')} ${i18n.t('status_label_status', userId, guildId)} — ${i18n.t('status_online', userId, guildId)}`)
        )
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(iconUrl).setDescription(address));
      container.addSectionComponents(section);
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));

      const infoLine1 = `${icons.emoji('layers')} **${i18n.t('status_version', userId, guildId)}** \`${data.version || 'Unknown'}\`  ·  ${icons.emoji('userround')} **${i18n.t('status_players', userId, guildId)}** \`${data.players?.online || 0} / ${data.players?.max || 0}\``;
      const infoLine2 = `${icons.emoji('settings')} **${i18n.t('status_software', userId, guildId)}** \`${data.software || 'Vanilla/Unknown'}\`  ·  ${icons.emoji('globe')} **${i18n.t('status_label_port', userId, guildId)}** \`${data.port || 25565}\`  ·  **${i18n.t('status_label_srv', userId, guildId)}** \`${data.hostname ? 'Yes' : 'No'}\``;
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${infoLine1}\n${infoLine2}`));

      const motd = data.motd?.clean?.join('\n') || 'No MOTD';
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('info')} **${i18n.t('status_motd', userId, guildId)}**\n${motd.slice(0, 900)}`));

      if (data.players?.list?.length) {
        const playersList = data.players.list.map(p => p.name).join(', ');
        const clipped = playersList.length > 800 ? playersList.slice(0, 797) + '...' : playersList;
        container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
        container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('userround')} **${i18n.t('status_players_sample', userId, guildId)}**\n${clipped}`));
      }

      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${address} · <t:${Math.floor(Date.now()/1000)}:R>`));

      await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
    } catch (error) {
      console.error('Status command failed:', error);
      await interaction.editReply(i18n.t('status_error', userId, guildId));
    }
  }
};
