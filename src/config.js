import env from 'env-var';
import { config as dotenv } from 'dotenv';

dotenv();

console.log({
  openAiApiKey: process.env.OPEN_AI_KEY,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  botToken: process.env.BOT_TOKEN,
});

export const config = {
  openAi: {
    apiKey: env.get('OPEN_AI_KEY').required().asString(),
  },
  discord: {
    clientId: env.get('CLIENT_ID').required().asString(),
    guildId: env.get('GUILD_ID').required().asString(),
    botToken: env.get('BOT_TOKEN').required().asString(),
  },
};
