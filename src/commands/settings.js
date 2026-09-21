const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');
const guildSettingsStore = require('../utils/guildSettingsStore');
const i18n = require('../services/i18n');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Configure bot settings for this server.')
    .addSubcommand((sub) =>
      sub
        .setName('language')
        .setDescription('Change the bot language.')
        .addStringOption((opt) =>
          opt
            .setName('scope')
            .setDescription('Apply language to yourself or the whole server')
            .setRequired(true)
            .addChoices(
              { name: 'Me (Personal)', value: 'user' },
              { name: 'Server (Admin Only)', value: 'guild' }
            )
        )
        .addStringOption((opt) =>
          opt
            .setName('lang')
            .setDescription('Choose a language')
            .setRequired(true)
            .addChoices(
              { name: 'English', value: 'en' },
              { name: 'العربية (Arabic)', value: 'ar' },
              { name: 'Français (French)', value: 'fr' },
              { name: 'हिंदी (Hindi)', value: 'hi' }
            )
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guildId;
    const userId = interaction.user.id;

    if (subcommand === 'language') {
      const scope = interaction.options.getString('scope', true);
      const lang = interaction.options.getString('lang', true);

      if (scope === 'guild') {
        // Check if the user is the server owner
        if (interaction.user.id !== interaction.guild.ownerId) {
          try {
            return await interaction.reply({ 
              content: i18n.t('settings_owner_only', userId, guildId), 
              flags: [MessageFlags.Ephemeral] 
            });
          } catch (err) {
            console.error('Failed to send permission error reply:', err);
            return;
          }
        }
        guildSettingsStore.setSetting(guildId, 'language', lang);
      } else {
        const userSettingsStore = require('../utils/userSettingsStore');
        userSettingsStore.setSetting(userId, 'language', lang);
      }
      
      const successMsg = i18n.t('settings_lang_success', userId, guildId);
      try {
        await interaction.reply({ content: successMsg, flags: [MessageFlags.Ephemeral] });
      } catch (err) {
        console.error('Failed to send success reply:', err);
      }
    }

  }
};

