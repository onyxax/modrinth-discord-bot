const { SlashCommandBuilder, MessageFlags, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SectionBuilder, ThumbnailBuilder } = require('discord.js');
const modlistStore = require('../utils/modlistStore');
const modrinthService = require('../services/modrinth');
const i18n = require('../services/i18n');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modlist')
    .setDescription('Create and share lists of Minecraft mods!')
    .addSubcommand((sub) =>
      sub
        .setName('create')
        .setDescription('Create a new modlist')
        .addStringOption((opt) => opt.setName('name').setDescription('Name of the list').setRequired(true))
    )
    .addSubcommand((sub) =>
      sub
        .setName('add')
        .setDescription('Add a mod to one of your lists')
        .addStringOption((opt) =>
          opt
            .setName('list')
            .setDescription('Name of the list')
            .setRequired(true)
            .setAutocomplete(true)
        )
        .addStringOption((opt) =>
          opt
            .setName('mod')
            .setDescription('Search for a mod to add')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('list')
        .setDescription('Show your saved modlists')
    )
    .addSubcommand((sub) =>
      sub
        .setName('share')
        .setDescription('Share a modlist in the current channel')
        .addStringOption((opt) =>
          opt
            .setName('list')
            .setDescription('Name of the list to share')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((sub) =>
      sub
        .setName('delete')
        .setDescription('Delete a modlist')
        .addStringOption((opt) =>
          opt
            .setName('list')
            .setDescription('Name of the list to delete')
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  async autocomplete(interaction) {
    try {
      const focusedOption = interaction.options.getFocused(true);
      const userId = interaction.user.id;
      const userLists = modlistStore.getModlists(userId);
      const respondSafely = async (choices) => {
        try {
          await interaction.respond(choices);
        } catch (err) {
          if (err.code !== 10062) {
            console.error('Failed to respond to modlist autocomplete:', err);
          }
        }
      };
      if (focusedOption.name === 'list') {
        const choices = Object.keys(userLists);
        const filtered = choices.filter((c) => c.toLowerCase().includes(focusedOption.value.toLowerCase()));
        await respondSafely(filtered.map((c) => ({ name: c, value: c })));
      } else if (focusedOption.name === 'mod') {
        if (!focusedOption.value) {
          return await respondSafely([]);
        }
        let results = [];
        try {
          results = await modrinthService.searchProjects({
            query: focusedOption.value,
            projectType: 'mod',
            size: 10,
            skipDetails: true,
            timeout: 2500
          });
        } catch (e) {
          if (e.code === 'ECONNABORTED' || e.code === 'ETIMEDOUT') {
            console.warn('Modlist autocomplete search timed out (2.5s)');
          } else {
            console.error('Modlist mod autocomplete search failed:', e.message);
          }
        }
        await respondSafely(results.map((r) => ({ name: r.name, value: r.slug })));
      }
    } catch (err) {
      if (err.code !== 10062) {
        console.error('Autocomplete error in modlist.js:', err);
      }
    }
  },

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    if (subcommand === 'create') {
      const name = interaction.options.getString('name', true);
      const lists = modlistStore.getModlists(userId);
      if (lists[name]) {
        try {
          return await interaction.reply({ content: `${icons.emoji('x')} ${i18n.t('modlist_exists', userId, guildId)}`, flags: [MessageFlags.Ephemeral] });
        } catch (err) {
          console.error('Failed to reply to modlist create (exists):', err);
          return;
        }
      }
      modlistStore.saveModlist(userId, name, []);
      try {
        await interaction.reply({ content: `${icons.emoji('check')} ${i18n.t('modlist_created', userId, guildId)}: **${name}**`, flags: [MessageFlags.Ephemeral] });
      } catch (err) {
        console.error('Failed to reply to modlist create (success):', err);
      }
    }

    if (subcommand === 'add') {
      const listName = interaction.options.getString('list', true);
      const modSlug = interaction.options.getString('mod', true);
      const lists = modlistStore.getModlists(userId);
      if (!lists[listName]) {
        try {
          return await interaction.reply({ content: `${icons.emoji('x')} ${i18n.t('modlist_not_found', userId, guildId)}`, flags: [MessageFlags.Ephemeral] });
        } catch (err) {
          console.error('Failed to reply to modlist add (not found):', err);
          return;
        }
      }
      if (!lists[listName].includes(modSlug)) {
        lists[listName].push(modSlug);
        modlistStore.saveModlist(userId, listName, lists[listName]);
      }
      try {
        await interaction.reply({ content: `${icons.emoji('check')} ${i18n.t('modlist_added', userId, guildId)} **${listName}**`, flags: [MessageFlags.Ephemeral] });
      } catch (err) {
        console.error('Failed to reply to modlist add (success):', err);
      }
    }

    if (subcommand === 'list') {
      const lists = modlistStore.getModlists(userId);
      const listNames = Object.keys(lists);
      if (!listNames.length) {
        try {
          return await interaction.reply({ content: `${icons.emoji('search')} ${i18n.t('modlist_empty_user', userId, guildId)}`, flags: [MessageFlags.Ephemeral] });
        } catch (err) {
          console.error('Failed to reply to modlist list (empty):', err);
          return;
        }
      }
      const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${icons.emoji('list')} ${i18n.t('modlist_your_lists', userId, guildId)}`));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(listNames.map(n => `${icons.emoji('list')} **${n}** — \`${lists[n].length}\` mods`).join('\n')));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${i18n.t('modlist_footer', userId, guildId)}`));
      try {
        await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
      } catch (err) {
        console.error('Failed to reply to modlist list (success):', err);
      }
    }

    if (subcommand === 'share') {
      try {
        await interaction.deferReply();
      } catch (err) {
        console.error('Failed to defer reply for modlist share:', err);
        return;
      }
      const listName = interaction.options.getString('list', true);
      const lists = modlistStore.getModlists(userId);
      if (!lists[listName]) {
        try {
          return await interaction.editReply({ content: `${icons.emoji('x')} ${i18n.t('modlist_not_found', userId, guildId)}` });
        } catch (err) {
          console.error('Failed to edit reply for modlist share (not found):', err);
          return;
        }
      }
      const mods = lists[listName];
      if (!mods.length) {
        try {
          return await interaction.editReply({ content: `${icons.emoji('x')} ${i18n.t('error_modlist_empty', userId, guildId)}` });
        } catch (err) {
          console.error('Failed to edit reply for modlist share (empty):', err);
          return;
        }
      }
      const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);
      const section = new SectionBuilder()
        .addTextDisplayComponents(
          new TextDisplayBuilder().setContent(`## ${icons.emoji('list')} ${i18n.t('modlist_share_title', userId, guildId)} — ${listName}`),
          new TextDisplayBuilder().setContent(`-# ${interaction.user.username} · ${mods.length} mods`)
        )
        .setThumbnailAccessory(new ThumbnailBuilder().setURL(interaction.user.displayAvatarURL()).setDescription(interaction.user.username));
      container.addSectionComponents(section);
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(mods.map((slug, index) => `**${index + 1}.** [${slug}](https://modrinth.com/mod/${slug})`).join('\n')));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('package')} **Total** \`${mods.length}\``));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${i18n.t('modlist_footer', userId, guildId)}`));
      try {
        await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
      } catch (err) {
        console.error('Failed to edit reply for modlist share (success):', err);
      }
    }

    if (subcommand === 'delete') {
      const listName = interaction.options.getString('list', true);
      if (modlistStore.deleteModlist(userId, listName)) {
        try {
          await interaction.reply({ content: `${icons.emoji('check')} ${i18n.t('modlist_deleted', userId, guildId)}: **${listName}**`, flags: [MessageFlags.Ephemeral] });
        } catch (err) {
          console.error('Failed to reply to modlist delete (success):', err);
        }
      } else {
        try {
          await interaction.reply({ content: `${icons.emoji('x')} ${i18n.t('modlist_not_found', userId, guildId)}`, flags: [MessageFlags.Ephemeral] });
        } catch (err) {
          console.error('Failed to reply to modlist delete (not found):', err);
        }
      }
    }
  }
};
