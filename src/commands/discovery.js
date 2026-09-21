const { SlashCommandBuilder, MessageFlags, TextDisplayBuilder, ContainerBuilder, SeparatorBuilder } = require('discord.js');
const modrinthService = require('../services/modrinth');
const i18n = require('../services/i18n');
const { buildResourceContainer } = require('../utils/embedBuilders');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

const DISCOVERY_CATEGORIES = [
  { name: 'Optimization (FPS)', value: 'optimization' },
  { name: 'Adventure', value: 'adventure' },
  { name: 'Magic', value: 'magic' },
  { name: 'Technology', value: 'technology' },
  { name: 'Decoration', value: 'decoration' },
  { name: 'Combat', value: 'combat' },
  { name: 'Mobs', value: 'mobs' },
  { name: 'Utility', value: 'utility' },
  { name: 'Worldgen', value: 'worldgen' },
  { name: 'Food', value: 'food' },
  { name: 'Equipment', value: 'equipment' },
  { name: 'Library', value: 'library' },
  { name: 'Minigame', value: 'minigame' },
  { name: 'Cursed', value: 'cursed' },
  { name: 'Social', value: 'social' },
  { name: 'Storage', value: 'storage' },
  { name: 'Management', value: 'management' },
  { name: 'Economy', value: 'economy' },
  { name: 'Game Mechanics', value: 'game-mechanics' },
  { name: 'Transportation', value: 'transportation' },
  { name: 'Tweaks', value: 'tweaks' },
  { name: 'Vanilla-like', value: 'vanilla-like' },
  { name: 'Fantasy', value: 'fantasy' },
  { name: 'Realistic', value: 'realistic' },
  { name: 'Challenging', value: 'challenging' },
  { name: 'Lightweight', value: 'lightweight' },
  { name: 'Kitchen-sink', value: 'kitchen-sink' },
  { name: 'Quests', value: 'quests' },
  { name: 'Multiplayer', value: 'multiplayer' },
  { name: 'Skyblock', value: 'skyblock' },
  { name: 'Parkour', value: 'parkour' },
  { name: 'Prison', value: 'prison' },
  { name: 'Factions', value: 'factions' },
  { name: 'RPG', value: 'rpg' },
  { name: 'Bedwars', value: 'bedwars' },
  { name: 'Survival Mode', value: 'survival-mode' },
  { name: 'Creative Mode', value: 'creative-mode' },
  { name: 'Hardcore Mode', value: 'hardcore-mode' },
  { name: 'Oneblock', value: 'oneblock' },
  { name: 'Lifesteal', value: 'lifesteal' },
  { name: 'PvP', value: 'pvp' },
  { name: 'PvE', value: 'pve' },
  { name: 'Dungeons', value: 'dungeons' },
  { name: 'Bosses', value: 'bosses' },
  { name: 'Entities', value: 'entities' },
  { name: 'Atmosphere', value: 'atmosphere' },
  { name: 'Audio', value: 'audio' },
  { name: 'Blocks', value: 'blocks' },
  { name: 'Fonts', value: 'fonts' },
  { name: 'GUI', value: 'gui' }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('discovery')
    .setDescription('Discover random Minecraft mods and resources!')
    .addStringOption((option) =>
      option
        .setName('intent')
        .setDescription('What kind of mods are you looking for?')
        .setAutocomplete(true)
    ),
  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const filtered = DISCOVERY_CATEGORIES.filter((cat) =>
      cat.name.toLowerCase().includes(focusedValue) || cat.value.toLowerCase().includes(focusedValue)
    ).slice(0, 25);
    await interaction.respond(filtered.map((cat) => ({ name: cat.name, value: cat.value })));
  },
  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const selectedIntent = interaction.options.getString('intent');
    await interaction.deferReply();
    try {
      let loader = selectedIntent;
      if (!loader) {
        const categories = ['optimization', 'adventure', 'utility', 'magic', 'decoration'];
        loader = categories[Math.floor(Math.random() * categories.length)];
      }
      const randomOffset = Math.floor(Math.random() * 50);
      const projects = await modrinthService.searchProjects({
        query: '',
        projectType: 'mod',
        loader: loader,
        size: 2,
        offset: randomOffset
      });
      if (!projects || projects.length === 0) {
        return interaction.editReply(`${icons.emoji('x')} ${i18n.t('error_discovery_not_found', userId, guildId)}`);
      }

      const intentName = DISCOVERY_CATEGORIES.find(c => c.value === loader)?.name || loader;

      const header = new ContainerBuilder()
        .setAccentColor(theme.ACCENT_COLOR)
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${icons.emoji('draftingcompass')} ${i18n.t('discovery_title', userId, guildId)} — ${intentName}`))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1))
        .addTextDisplayComponents(new TextDisplayBuilder().setContent(`${icons.emoji('search')} ${i18n.t('discovery_desc', userId, guildId)}`))
        .addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));

      const resourceContainers = projects.map((p) => buildResourceContainer(p, userId, guildId));

      await interaction.editReply({
        components: [header, ...resourceContainers],
        flags: MessageFlags.IsComponentsV2
      });
    } catch (error) {
      console.error('Discovery command failed:', error);
      await interaction.editReply(`${icons.emoji('x')} ${i18n.t('error_discovery_failed', userId, guildId)}`);
    }
  }
};
