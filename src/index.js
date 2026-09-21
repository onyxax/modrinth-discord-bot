const fs = require('fs');
const path = require('path');
const { Client, Collection, GatewayIntentBits, Events, ActivityType, MessageFlags } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require('./config');
const notifierService = require('./services/notifierService');
const serverStore = require('./utils/serverStore');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));
const rest = new REST({ version: '10' }).setToken(config.discordToken);

for (const file of commandFiles) {
  // eslint-disable-next-line security/detect-non-literal-require
  const command = require(path.join(commandsPath, file));
  if (command?.data?.name && typeof command.execute === 'function') {
    client.commands.set(command.data.name, command);
  }
}

const presenceStates = [
  () => ({ name: 'Modrinth | For help /help', type: ActivityType.Playing }),
  () => ({ name: 'Add Bot to Server | /add', type: ActivityType.Playing }),
  () => {
    const count = Math.max(serverStore.getCount(), client.guilds.cache.size);
    const label = count === 1 ? '1 server' : `${count} servers`;
    return { name: `The bot is in ${label}`, type: ActivityType.Playing };
  }
];

const setPresence = async (stateFactory) => {
  try {
    await client.user.setPresence({
      status: 'online',
      activities: [stateFactory()]
    });
  } catch (err) {
    console.error('Failed to set presence:', err);
  }
};

let presenceIndex = 0;

client.once(Events.ClientReady, async () => {
  const commandData = [...client.commands.values()].map((cmd) => cmd.data.toJSON());

  if (!config.clientId) {
    console.warn(
      'DISCORD_CLIENT_ID is not defined. Slash commands cannot be registered automatically.'
    );
  } else {
    try {
      await rest.put(Routes.applicationCommands(config.clientId), { body: commandData });
      console.log('Slash commands registered globally.');
    } catch (error) {
      console.error('Failed to register slash commands.', error);
    }
  }

  client.guilds.cache.forEach((guild) => {
    serverStore.addGuild(guild.id, guild.name);
  });

  await setPresence(presenceStates[presenceIndex]);
  setInterval(() => {
    presenceIndex = (presenceIndex + 1) % presenceStates.length;
    setPresence(presenceStates[presenceIndex]);
  }, 5000);

  notifierService.init(client);
  console.log(`${config.botName} ready as ${client.user.tag}.`);
});


client.on('interactionCreate', async (interaction) => {
  if (interaction.isAutocomplete()) {
    const command = client.commands.get(interaction.commandName);
    if (command?.autocomplete) {
      try {
        await command.autocomplete(interaction);
      } catch (error) {
        console.error('Autocomplete handler error:', error);
      }
    }
    return;
  }

  if (!interaction.isChatInputCommand()) return;

  if (!interaction.guild) {
    try {
      await interaction.reply({
        content: 'Commands are only available inside servers.',
        flags: [MessageFlags.Ephemeral]
      });
    } catch (err) {
      console.error('Failed to reply to non-guild interaction:', err);
    }
    return;
  }

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Command execution failed:', error);
    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply({
          content: 'The bot encountered an error while executing the command. Please try again later.',
          flags: [MessageFlags.Ephemeral]
        });
      } catch (replyError) {
        console.error('Failed to send error reply:', replyError);
      }
    } else if (interaction.deferred || interaction.replied) {
      try {
        await interaction.editReply({
          content: 'The bot encountered an error while executing the command. Please try again later.'
        });
      } catch (editError) {
        console.error('Failed to edit error reply:', editError);
      }
    }
  }
});


process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
});

client.on('guildCreate', (guild) => {
  serverStore.addGuild(guild.id, guild.name);
});

client.on('guildDelete', (guild) => {
  serverStore.removeGuild(guild.id);
});

client.login(config.discordToken);
