const { SlashCommandBuilder, MessageFlags, ContainerBuilder, TextDisplayBuilder, SeparatorBuilder, SectionBuilder, MediaGalleryBuilder, MediaGalleryItemBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const axios = require('axios');
const i18n = require('../services/i18n');
const theme = require('../utils/theme');
const icons = require('../utils/icons');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('seeds')
    .setDescription('Discover amazing Minecraft seeds from the community.')
    .addStringOption((option) =>
      option
        .setName('platform')
        .setDescription('Choose the platform (Java or Bedrock)')
        .setRequired(false)
        .addChoices(
          { name: 'Java', value: 'java' },
          { name: 'Bedrock', value: 'bedrock' }
        )
    )
    .addStringOption((option) =>
      option
        .setName('version')
        .setDescription('Filter by Minecraft version')
        .setRequired(false)
        .addChoices(
          { name: '1.21', value: '1.21' },
          { name: '1.20', value: '1.20' },
          { name: '1.19', value: '1.19' },
          { name: '1.18', value: '1.18' },
          { name: '1.17', value: '1.17' },
          { name: '1.16', value: '1.16' }
        )
    ),

  async execute(interaction) {
    const userId = interaction.user.id;
    const guildId = interaction.guildId;
    const platformOpt = interaction.options.getString('platform');
    const versionOpt = interaction.options.getString('version');
    await interaction.deferReply();
    const useLegacy = platformOpt === 'java' && versionOpt && ['1.16', '1.17', '1.18', '1.19'].includes(versionOpt);
    try {
      if (useLegacy) {
        await this.handleLegacySource(interaction, userId, guildId, versionOpt);
      } else {
        await this.handleRedditSource(interaction, userId, guildId, platformOpt, versionOpt);
      }
    } catch (error) {
      console.error('Seeds command failed:', error);
      await interaction.editReply(`${icons.emoji('x')} ${i18n.t('error_seeds_failed', userId, guildId)}`);
    }
  },

  async handleLegacySource(interaction, userId, guildId, versionOpt) {
    const { data } = await axios.get('https://minecraftseeds.vercel.app/', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const match = data.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
    if (!match) throw new Error('Legacy data not found');
    const json = JSON.parse(match[1]);
    let posts = json.props?.pageProps?.posts || [];
    if (versionOpt) {
      posts = posts.filter(p => p.version && p.version.includes(versionOpt));
    }
    if (posts.length === 0) {
      return interaction.editReply(`${icons.emoji('search')} ${i18n.t('seeds_no_match', userId, guildId)}`);
    }
    const seedData = posts[Math.floor(Math.random() * posts.length)];
    const container = this.createSeedContainer(seedData, userId, guildId);
    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  },

  async handleRedditSource(interaction, userId, guildId, platformOpt, versionOpt) {
    let query = 'subreddit:minecraftseeds ';
    if (platformOpt) query += `flair:"${platformOpt.charAt(0).toUpperCase() + platformOpt.slice(1)}" `;
    if (versionOpt) query += `flair:"${versionOpt}" `;
    if (!platformOpt && !versionOpt) query += '(flair:"1.21" OR flair:"1.20" OR flair:"Bedrock")';
    const url = `https://www.reddit.com/r/minecraftseeds/search.json?q=${encodeURIComponent(query)}&sort=new&restrict_sr=on&limit=50`;
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'ModrinthBot/1.0' }
    });
    const rawPosts = data.data.children.filter(p => !p.data.stickied && (p.data.post_hint === 'image' || p.data.is_gallery || p.data.url.includes('i.redd.it')));
    if (rawPosts.length === 0) {
      return interaction.editReply(`${icons.emoji('search')} ${i18n.t('seeds_no_match', userId, guildId)}`);
    }
    const seedRegex = /-?\d{8,20}/g;
    const postsWithSeeds = rawPosts.filter(p => {
      const text = `${p.data.title} ${p.data.selftext}`;
      return seedRegex.test(text);
    });
    const finalPosts = postsWithSeeds.length > 0 ? postsWithSeeds : rawPosts;
    const randomPost = finalPosts[Math.floor(Math.random() * finalPosts.length)].data;
    const combinedText = `${randomPost.title} ${randomPost.selftext}`;
    const foundSeeds = combinedText.match(seedRegex);
    const seedNumber = foundSeeds ? foundSeeds[0] : 'Check link';
    let imageUrl = randomPost.url;
    if (randomPost.is_gallery && randomPost.media_metadata) {
      const firstImageId = Object.keys(randomPost.media_metadata)[0];
      imageUrl = `https://i.redd.it/${firstImageId}.jpg`;
    } else if (randomPost.preview?.images?.[0]?.source?.url) {
      imageUrl = randomPost.preview.images[0].source.url.replace(/&amp;/g, '&');
    }

    const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${icons.emoji('sprout')} ${randomPost.title.substring(0, 250)}`));
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    const desc = randomPost.selftext ? randomPost.selftext.substring(0, 500) : i18n.t('resource_no_desc', userId, guildId);
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(desc));
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${icons.emoji('search')} **${i18n.t('seeds_number', userId, guildId)}** \`${seedNumber}\`  ·  ${icons.emoji('globe')} **${i18n.t('seeds_platform', userId, guildId)}** \`${randomPost.link_flair_text || 'Java/Bedrock'}\`  ·  ${icons.emoji('layers')} **${i18n.t('status_version', userId, guildId)}** \`${versionOpt || 'Latest'}\``
      )
    );
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    if (imageUrl) {
      try {
        const gallery = new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(imageUrl).setDescription(randomPost.title.substring(0, 100)));
        container.addMediaGalleryComponents(gallery);
        container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      } catch (_) {}
    }
    const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel('Reddit').setStyle(ButtonStyle.Link).setURL(`https://reddit.com${randomPost.permalink}`));
    container.addActionRowComponents(row);
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# r/minecraftseeds · u/${randomPost.author}`));

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  },

  createSeedContainer(seedData, userId, guildId) {
    const seedNumber = seedData.seed || 'N/A';
    const imageUrl = seedData.image || '';
    const title = seedData.title || 'Amazing Minecraft Seed';
    const version = seedData.version || 'Any';
    const platform = seedData.java ? 'Java' : (seedData.bedrock ? 'Bedrock' : 'Java/Bedrock');
    let description = seedData.text || '';
    description = description.split('\n').filter(line => !line.includes('Link:') && !line.includes('Original author:')).join('\n').trim();
    if (description.length > 500) description = description.substring(0, 497) + '...';

    const container = new ContainerBuilder().setAccentColor(theme.ACCENT_COLOR);
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${icons.emoji('sprout')} ${title}`));
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    if (description) container.addTextDisplayComponents(new TextDisplayBuilder().setContent(description));
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    container.addTextDisplayComponents(
      new TextDisplayBuilder().setContent(
        `${icons.emoji('search')} **${i18n.t('seeds_number', userId, guildId)}** \`${seedNumber}\`  ·  ${icons.emoji('globe')} **${i18n.t('seeds_platform', userId, guildId)}** \`${platform}\`  ·  ${icons.emoji('layers')} **${i18n.t('status_version', userId, guildId)}** \`${version}\``
      )
    );
    container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
    if (imageUrl) {
      try {
        const gallery = new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(imageUrl).setDescription(title));
        container.addMediaGalleryComponents(gallery);
        container.addSeparatorComponents(new SeparatorBuilder().setDivider(true).setSpacing(1));
      } catch (_) {}
    }
    container.addTextDisplayComponents(new TextDisplayBuilder().setContent(`-# Modrinth Bot · Legacy Seed Source`));
    return container;
  }
};
