const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const envPath = path.resolve(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const requireEnv = (value, name) => {
  if (!value) {
    throw new Error(`Environment variable ${name} is required but was not provided.`);
  }
  return value;
};

const config = {
  botName: process.env.BOT_NAME || 'Modrinth Bot (unofficial)',
  discordToken: requireEnv(process.env.DISCORD_TOKEN || process.env.Token, 'DISCORD_TOKEN'),
  clientId: process.env.DISCORD_CLIENT_ID,
  modrinthToken: requireEnv(process.env.MODRINTH_TOKEN || process.env.modrinth, 'MODRINTH_TOKEN'),
  modrinthUserAgent:
    process.env.MODRINTH_USER_AGENT || 'Modrinth Bot (unofficial)/1.0 (discord bot; contact: support@example.com)',
  modrinthBaseUrl: 'https://api.modrinth.com/v2'
};

module.exports = config;
