const { SlashCommandBuilder, MessageFlags, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder } = require('discord.js');
const modrinthService = require('../services/modrinth');
const notificationStore = require('../utils/notificationStore');
const i18n = require('../services/i18n');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('notify')
    .setDescription('Manage update notifications for Modrinth projects.')
    .addSubcommand((sub) =>
      sub
        .setName('me')
        .setDescription('Follow a project to receive update alerts in DMs')
        .addStringOption((opt) =>
          opt
            .setName('type')
            .setDescription('The type of resource')
            .setRequired(true)
            .addChoices(
              { name: 'Mod', value: 'mod' },
              { name: 'Modpack', value: 'modpack' },
              { name: 'Resource Pack', value: 'resourcepack' },
              { name: 'Shader', value: 'shader' },
              { name: 'Datapack', value: 'datapack' },
              { name: 'Plugin', value: 'plugin' }
            )
        )
        .addStringOption((opt) =>
          opt
            .setName('project')
            .setDescription('Search for the project to follow')
            .setRequired(true)
            .setAutocomplete(true)
        )
    )
    .addSubcommand((sub) =>
      sub.setName('list').setDescription('List all projects you are following')
    )
    .addSubcommand((sub) =>
      sub
        .setName('remove')
        .setDescription('Stop following a project')
        .addStringOption((opt) =>
          opt
            .setName('project')
            .setDescription('Name or slug of the project to remove')
            .setRequired(true)
            .setAutocomplete(true)
        )
    ),

  async autocomplete(interaction) {
    const focusedOption = interaction.options.getFocused(true);
    const userId = interaction.user.id;
    const respondSafely = async (choices) => {
      try {
        await interaction.respond(choices);
      } catch (err) {
        if (err.code !== 10062) console.error('Notify autocomplete failed:', err);
      }
    };
    if (focusedOption.name === 'project') {
      const subcommand = interaction.options.getSubcommand();
      if (subcommand === 'me') {
        const type = interaction.options.getString('type') || 'mod';
        if (!focusedOption.value) return await respondSafely([]);
        try {
          const results = await modrinthService.searchProjects({
            query: focusedOption.value,
            projectType: type,
            size: 10,
            skipDetails: true,
            timeout: 2500
          });
          await respondSafely(results.map(r => ({ name: r.name, value: r.slug })));
        } catch (e) {
          await respondSafely([]);
        }
      } else if (subcommand === 'remove') {
        const following = notificationStore.getUserNotifications(userId);
        const choices = Object.keys(following).map(slug => ({ name: following[slug].name, value: slug }));
        const filtered = choices.filter(c => c.name.toLowerCase().includes(focusedOption.value.toLowerCase()));
        await respondSafely(filtered.slice(0, 25));
      }
    }
  },

  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const userId = interaction.user.id;
    const guildId = interaction.guildId;

    if (subcommand === 'me') {
      const slug = interaction.options.getString('project', true);
      const type = interaction.options.getString('type', true);
      await interaction.deferReply({ flags: [MessageFlags.Ephemeral] });
      try {
        const results = await modrinthService.searchProjects({ slug, projectType: type, size: 1 });
        if (!results.length) {
          return interaction.editReply(`${icons.emoji('x')} ${i18n.t('error_project_not_found', userId, guildId)}`);
        }
        const project = results[0];
        const versions = await modrinthService.getProjectVersions(project.slug);
        const latestVersionId = versions.length > 0 ? versions[0].id : null;
        notificationStore.addNotification(userId, project.slug, project.name, latestVersionId);
        await interaction.editReply(`${icons.emoji('check')} ${i18n.t('notify_added', userId, guildId)} **${project.name}**.`);
      } catch (error) {
        console.error('Notify me failed:', error);
        await interaction.editReply(`${icons.emoji('x')} ${i18n.t('error_notify_failed', userId, guildId)}`);
      }
    }

    if (subcommand === 'list') {
      const following = notificationStore.getUserNotifications(userId);
      const slugs = Object.keys(following);
      if (!slugs.length) {
        return interaction.reply({ content: `${icons.emoji('search')} ${i18n.t('notify_list_empty', userId, guildId)}`, flags: [MessageFlags.Ephemeral] });
      }
      const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${icons.emoji('bell')} ${i18n.t('notify_your_list', userId, guildId)}`));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(slugs.map(slug => `${icons.emoji('bell')} **${following[slug].name}** — \`${slug}\``).join('\n')));
      container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# ${interaction.client.user.username}`));
      await interaction.reply({ components: [container], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
    }

    if (subcommand === 'remove') {
      const slug = interaction.options.getString('project', true);
      const following = notificationStore.getUserNotifications(userId);
      const projectName = following[slug]?.name || slug;
      if (notificationStore.removeNotification(userId, slug)) {
        await interaction.reply({ content: `${icons.emoji('check')} ${i18n.t('notify_removed', userId, guildId)} **${projectName}**.`, flags: [MessageFlags.Ephemeral] });
      } else {
        await interaction.reply({ content: `${icons.emoji('x')} ${i18n.t('error_not_following', userId, guildId)}`, flags: [MessageFlags.Ephemeral] });
      }
    }
  }
};
