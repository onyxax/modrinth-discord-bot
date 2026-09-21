const {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ComponentType,
  MessageFlags,
  ContainerBuilder,
  TextDisplayBuilder,
  SeparatorBuilder,
  SectionBuilder,
  ThumbnailBuilder
} = require('discord.js');
const config = require('../config');
const i18n = require('../services/i18n');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

const buildHelpContainer = (selection, userId, guildId, clientUser) => {
  const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);

  const addHeader = (title, desc) => {
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${title}`));
    if (desc) container.addTextDisplayComponents(new TextDisplayBuilder().setContent(desc));
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
  };

  if (!selection) {
    const thumb = clientUser?.displayAvatarURL?.() || null;
    const section = new SectionBuilder()
      .addTextDisplayComponents(
        new TextDisplayBuilder().setContent(`## ${icons.emoji('bookopencheck')} ${config.botName} — ${i18n.t('help_title', userId, guildId)}`),
        new TextDisplayBuilder().setContent(i18n.t('help_desc', userId, guildId))
      );
    if (thumb) section.setThumbnailAccessory(new ThumbnailBuilder().setURL(thumb));
    container.addSectionComponents(section);
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${icons.emoji('info')} ${i18n.t('help_placeholder', userId, guildId)}`));
    return container;
  }

  switch (selection) {
    case 'commands': {
      addHeader(`${icons.emoji('list')} ${i18n.t('help_cat_commands', userId, guildId)}`, null);
      const lines = [
        `${icons.emoji('puzzle')} **/mods** — ${i18n.t('help_cmd_mods', userId, guildId)}`,
        `${icons.emoji('sparkles')} **/shaders** — ${i18n.t('help_cmd_shaders', userId, guildId)}`,
        `${icons.emoji('paintbrush')} **/resourcepacks** — ${i18n.t('help_cmd_resourcepacks', userId, guildId)}`,
        `${icons.emoji('folder')} **/datapacks** — ${i18n.t('help_cmd_datapacks', userId, guildId)}`,
        `${icons.emoji('package')} **/modpacks** — ${i18n.t('help_cmd_modpacks', userId, guildId)}`,
        `${icons.emoji('plug2')} **/plugins** — ${i18n.t('help_cmd_plugins', userId, guildId)}`,
        `${icons.emoji('server')} **/status** — ${i18n.t('help_cmd_status', userId, guildId)}`,
        `${icons.emoji('shield')} **/rank** — ${i18n.t('help_cmd_rank', userId, guildId)}`,
        `${icons.emoji('userround')} **/skin** — ${i18n.t('help_cmd_skin', userId, guildId)}`,
        `${icons.emoji('sprout')} **/seeds** — ${i18n.t('help_cmd_seeds', userId, guildId)}`,
        `${icons.emoji('search')} **/discovery** — ${i18n.t('help_cmd_discovery', userId, guildId)}`,
        `${icons.emoji('dices')} **/random** — ${i18n.t('help_cmd_random', userId, guildId)}`,
        `${icons.emoji('list')} **/modlist** — ${i18n.t('help_cmd_modlist', userId, guildId)}`,
        `${icons.emoji('userround')} **/user** — ${i18n.t('help_cmd_user', userId, guildId)}`,
        `${icons.emoji('bell')} **/notify** — ${i18n.t('help_cmd_notify', userId, guildId)}`,
        `${icons.emoji('barchart3')} **/botstatus** — ${i18n.t('help_cmd_botstatus', userId, guildId)}`,
        `${icons.emoji('settings')} **/settings** — ${i18n.t('help_cmd_settings', userId, guildId)}`,
        `${icons.emoji('link2')} **/add** — ${i18n.t('help_cmd_add', userId, guildId)}`
      ];
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(lines.join('\n')));
      break;
    }
    case 'mods': {
      addHeader(`${icons.emoji('puzzle')} ${i18n.t('help_guide_mods_title', userId, guildId)}`, i18n.t('help_cat_mods_desc', userId, guildId));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('info')} **About**\n${i18n.t('help_cat_mods_desc', userId, guildId)} — ${i18n.t('help_guide_mods_title', userId, guildId).replace(/^[^\w]*/, '')}`));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('list')} **Steps**\n${i18n.t('help_guide_mods_steps', userId, guildId)}`));
      break;
    }
    case 'modpacks': {
      addHeader(`${icons.emoji('package')} ${i18n.t('help_guide_modpacks_title', userId, guildId)}`, `${icons.emoji('info')} ${i18n.t('help_cat_modpacks_desc', userId, guildId)}`);
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('info')} **About**\n${i18n.t('help_guide_modpacks_about', userId, guildId)}`));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('layers')} **Launchers**\n${i18n.t('help_guide_modpacks_launchers', userId, guildId)}`));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('list')} **Steps**\n${i18n.t('help_guide_modpacks_steps', userId, guildId)}`));
      break;
    }
    case 'resourcepacks': {
      addHeader(`${icons.emoji('paintbrush')} ${i18n.t('help_guide_rp_title', userId, guildId)}`, i18n.t('help_cat_resourcepacks_desc', userId, guildId));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('info')} **About**\n${i18n.t('help_cat_resourcepacks_desc', userId, guildId)}`));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('list')} **Steps**\n${i18n.t('help_guide_rp_steps', userId, guildId)}`));
      break;
    }
    case 'shaders': {
      addHeader(`${icons.emoji('sparkles')} ${i18n.t('help_guide_shaders_title', userId, guildId)}`, i18n.t('help_cat_shaders_desc', userId, guildId));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('info')} **About**\n${i18n.t('help_cat_shaders_desc', userId, guildId)}`));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('list')} **Steps**\n${i18n.t('help_guide_shaders_steps', userId, guildId)}`));
      break;
    }
    case 'datapacks': {
      addHeader(`${icons.emoji('folder')} ${i18n.t('help_guide_dp_title', userId, guildId)}`, `${icons.emoji('info')} ${i18n.t('help_cat_datapacks_desc', userId, guildId)}`);
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('info')} **About**\n${i18n.t('help_guide_dp_about', userId, guildId)}`));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('list')} **Steps**\n${i18n.t('help_guide_dp_steps', userId, guildId)}`));
      break;
    }
    case 'plugins': {
      addHeader(`${icons.emoji('plug2')} ${i18n.t('help_guide_plugins_title', userId, guildId)}`, `${icons.emoji('info')} ${i18n.t('help_cat_plugins_desc', userId, guildId)}`);
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('info')} **About**\n${i18n.t('help_guide_plugins_about', userId, guildId)}`));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('list')} **Steps**\n${i18n.t('help_guide_plugins_steps', userId, guildId)}`));
      break;
    }
    case 'guide': {
      addHeader(`${icons.emoji('bookopencheck')} ${i18n.t('help_guide_full_title', userId, guildId)}`, i18n.t('help_guide_full_intro', userId, guildId));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `${icons.emoji('search')} **${i18n.t('help_cat_commands', userId, guildId)}**\n${i18n.t('help_guide_full_search', userId, guildId)}`
      ));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(
        `${icons.emoji('list')} **Modlists**\n${i18n.t('help_guide_full_modlist', userId, guildId)}\n\n${icons.emoji('bell')} **Notifications**\n${i18n.t('help_guide_full_notify', userId, guildId)}\n\n${icons.emoji('server')} **Server Status**\n${i18n.t('help_guide_full_status', userId, guildId)}\n\n${icons.emoji('userround')} **Developers**\n${i18n.t('help_guide_full_user', userId, guildId)}\n\n${icons.emoji('search')} **Discovery**\n${i18n.t('help_guide_full_discovery', userId, guildId)}\n\n${icons.emoji('shield')} **Rankings**\n${i18n.t('help_guide_full_rank', userId, guildId)}`
      ));
      break;
    }
  }

  container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
  container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${icons.emoji('info')} ${config.botName} — ${i18n.t('help_footer', userId, guildId) || 'Modrinth Bot'}`));
  return container;
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Show interactive help for commands and installation.'),
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help_select')
      .setPlaceholder(i18n.t('help_placeholder', userId, guildId))
      .addOptions([
        { label: i18n.t('help_cat_commands', userId, guildId), description: i18n.t('help_cat_commands_desc', userId, guildId), value: 'commands', emoji: { id: icons.ICONS.list.id, name: icons.ICONS.list.name } },
        { label: i18n.t('help_cat_mods', userId, guildId), description: i18n.t('help_cat_mods_desc', userId, guildId), value: 'mods', emoji: { id: icons.ICONS.puzzle.id, name: icons.ICONS.puzzle.name } },
        { label: i18n.t('help_cat_modpacks', userId, guildId), description: i18n.t('help_cat_modpacks_desc', userId, guildId), value: 'modpacks', emoji: { id: icons.ICONS.package.id, name: icons.ICONS.package.name } },
        { label: i18n.t('help_cat_resourcepacks', userId, guildId), description: i18n.t('help_cat_resourcepacks_desc', userId, guildId), value: 'resourcepacks', emoji: { id: icons.ICONS.paintbrush.id, name: icons.ICONS.paintbrush.name } },
        { label: i18n.t('help_cat_shaders', userId, guildId), description: i18n.t('help_cat_shaders_desc', userId, guildId), value: 'shaders', emoji: { id: icons.ICONS.sparkles.id, name: icons.ICONS.sparkles.name } },
        { label: i18n.t('help_cat_datapacks', userId, guildId), description: i18n.t('help_cat_datapacks_desc', userId, guildId), value: 'datapacks', emoji: { id: icons.ICONS.folder.id, name: icons.ICONS.folder.name } },
        { label: i18n.t('help_cat_plugins', userId, guildId), description: i18n.t('help_cat_plugins_desc', userId, guildId), value: 'plugins', emoji: { id: icons.ICONS.plug2.id, name: icons.ICONS.plug2.name } },
        { label: i18n.t('help_cat_guide', userId, guildId), description: i18n.t('help_cat_guide_desc', userId, guildId), value: 'guide', emoji: { id: icons.ICONS.bookopencheck.id, name: icons.ICONS.bookopencheck.name } }
      ]);

    const buildReply = (selection, menu) => {
      const container = buildHelpContainer(selection, userId, guildId, interaction.client.user);
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addActionRowComponents(new ActionRowBuilder().addComponents(menu));
      return container;
    };

    const initialContainer = buildReply(null, selectMenu);

    let response;
    try {
      response = await interaction.reply({
        components: [initialContainer],
        flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral
      });
    } catch (err) {
      console.error('Failed to send help reply:', err);
      return;
    }

    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.StringSelect,
      time: 300000
    });

    collector.on('collect', async (i) => {
      const selection = i.values[0];
      try {
        const container = buildReply(selection, selectMenu);
        await i.update({ components: [container], flags: MessageFlags.IsComponentsV2 });
      } catch (err) {
        console.error('Failed to update help interaction:', err);
      }
    });

    collector.on('end', () => {
      const disabledMenu = StringSelectMenuBuilder.from(selectMenu).setDisabled(true).setPlaceholder('Help session expired.');
      const expiredContainer = buildReply(null, disabledMenu);
      // نعيد بناء المحتوى كمُنتهٍ
      const finalContainer = new ContainerBuilder()
        .setAccentColor(theme.ACCENT_COLOR)
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${icons.emoji('bookopencheck')} ${config.botName} — ${i18n.t('help_title', userId, guildId)}`))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${icons.emoji('info')} Help session expired.`))
        .addActionRowComponents(new ActionRowBuilder().addComponents(disabledMenu));
      interaction.editReply({ components: [finalContainer], flags: MessageFlags.IsComponentsV2 }).catch(() => {});
    });
  }
};
