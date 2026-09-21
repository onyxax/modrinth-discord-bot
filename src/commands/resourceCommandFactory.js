const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const modrinthService = require('../services/modrinth');
const { buildResourceContainer } = require('../utils/embedBuilders');
const i18n = require('../services/i18n');
const icons = require('../utils/icons');
const config = require('../config');

const gatherResources = async (
  { query, projectType, version, loader, slug, maxResults = 5, skipDetails = false, timeout } = {}
) => {
  try {
    const results = await modrinthService.searchProjects({
      query,
      projectType,
      version,
      loader,
      slug,
      size: slug ? 1 : maxResults,
      skipDetails,
      timeout
    });

    const ordered = results
      .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
      .slice(0, maxResults);
    return { results: ordered, errors: [] };
  } catch (error) {
    console.error('Modrinth search failed:', error);
    return { results: [], errors: [`Modrinth: ${error.message}`] };
  }
};

const createSearchCommand = ({ name, description, projectType, includeLoader = false } = {}) => {
  const handleAutocomplete = async (interaction) => {
    const query = interaction.options.getFocused();
    if (!query) {
      try {
        await interaction.respond([]);
      } catch (err) {
        if (err.code !== 10062) {
          console.error('Failed to respond to empty autocomplete:', err);
        }
      }
      return;
    }


    try {
      const { results } = await gatherResources({
        query,
        projectType,
        maxResults: 10,
        skipDetails: true,
        timeout: 2500
      });

      const choices = results.map((resource) => ({
        name: `${resource.name} (${resource.platform})`,
        value: resource.slug || resource.name
      }));

      try {
        await interaction.respond(choices.slice(0, 25));
      } catch (err) {
        if (err.code !== 10062) {
          console.error('Failed to respond to autocomplete:', err);
        }
      }
    } catch (error) {
      if (error.code !== 10062) {
        console.error('Autocomplete failed for', name, error.message);
      }
      try {
        await interaction.respond([]);
      } catch (err) {
        // Silently ignore expired interactions
      }
    }

  };

  const builder = new SlashCommandBuilder()
    .setName(name)
    .setDescription(description)
    .addStringOption((option) =>
      option
        .setName('query')
        .setDescription('Search keywords')
        .setDescriptionLocalizations({
          hi: 'खोज'
        })
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((option) =>
      option
        .setName('version')
        .setDescription('Minecraft version (e.g. 1.20.4)')
        .setDescriptionLocalizations({
          hi: 'संस्करण'
        })
        .setRequired(false)
    );

  if (includeLoader) {
    builder.addStringOption((option) =>
      option
        .setName('loader')
        .setDescription('Loader name (Fabric, Forge, NeoForge, etc.)')
        .setDescriptionLocalizations({
          hi: 'लोडर'
        })
        .setRequired(false)
    );
  }

  return {
    data: builder,
    async execute(interaction) {
      try {
        await interaction.deferReply();
      } catch (err) {
        console.error('Failed to defer reply:', err);
        return;
      }
      
      const query = interaction.options.getString('query', true);
      const version = interaction.options.getString('version');
      const loader = includeLoader ? interaction.options.getString('loader') : null;

      try {
        const loaderValue = loader?.trim().toLowerCase() || null;
        const normalizedQuery = query.trim();
        const slugCandidate = normalizedQuery.toLowerCase();
        const slugHint = /^[a-z0-9-]+$/.test(slugCandidate) ? slugCandidate : null;

        const { results, errors } = await gatherResources({
          query: normalizedQuery,
          projectType,
          version,
          loader: loaderValue,
          slug: slugHint
        });

        if (!results.length) {
          const baseMessage = i18n.t('error_no_resources', interaction.user.id, interaction.guildId, { query });
          const detail = errors.length ? `\nNotes: ${errors.join(' | ')}` : '';
          await interaction.editReply({ content: `${icons.emoji('x')} ` + baseMessage + detail });
          return;
        }

        // حد Components V2: 40 مكون إجمالي — نقلص إلى 2 موارد كحد أقصى مع 3 أسطر تحت العنوان (كل حاوية ~14 مكونًا)
        const limited = results.slice(0, 2);
        const containers = limited.map((resource) => buildResourceContainer(resource, interaction.user.id, interaction.guildId));
        let notes = errors.length ? `Notes: ${errors.join(' | ')}` : null;
        if (results.length > 2) {
          notes = (notes ? notes + ' | ' : '') + `Showing 2 of ${results.length} results`;
        }

        if (notes) {
          const { TextDisplayBuilder } = require('discord.js');
          const noteDisplay = new TextDisplayBuilder().setContent(`-# ${notes}`);
          await interaction.editReply({
            components: [noteDisplay, ...containers],
            flags: MessageFlags.IsComponentsV2
          });
          return;
        }

        await interaction.editReply({
          components: containers,
          flags: MessageFlags.IsComponentsV2
        });
      } catch (error) {
        console.error('Search command execution error:', error);
        try {
          await interaction.editReply({
            content: `${icons.emoji('x')} ${i18n.t('error_internal', interaction.user.id, interaction.guildId)}`
          });
        } catch (editError) {
          console.error('Failed to edit error reply:', editError);
        }
      }
    },
    async autocomplete(interaction) {
      await handleAutocomplete(interaction);
    }
  };
};


module.exports = createSearchCommand;
