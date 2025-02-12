import env from 'env-var';
import { config as dotenv } from 'dotenv';

dotenv();

export const config = {
  openAi: {
    apiKey: env.get('OPEN_AI_KEY').required().asString(),
  },
  mistral: {
    apiKey: env.get('MISTRAL_KEY').required().asString(),
  },
  discord: {
    clientId: env.get('CLIENT_ID').required().asString(),
    guildId: env.get('GUILD_ID').required().asString(),
    botToken: env.get('BOT_TOKEN').required().asString(),
    promptEsca: env.get('PROMPT_ESCA').required().asString(),
  },
};
