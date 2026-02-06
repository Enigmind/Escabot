import env from 'env-var';
import { config as dotenv } from 'dotenv';

dotenv();

export const config = {
  mistral: {
    apiKey: env.get('MISTRAL_KEY').required().asString(),
  },
  gemini: {
    apiKey: env.get('GEMINI_API_KEY').required().asString(),
  },
  discord: {
    clientId: env.get('CLIENT_ID').required().asString(),
    guildId: env.get('GUILD_ID').required().asString(),
    botToken: env.get('BOT_TOKEN').required().asString(),
    promptEsca: env.get('PROMPT_ESCA').required().asString(),
  },
};
