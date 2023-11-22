import { REST } from '@discordjs/rest';
import { commands } from './commands/index.js';
import { Routes } from 'discord-api-types/v9';

import { config } from 'dotenv';

config();
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const bot_token = process.env.BOT_TOKEN;

const rest = new REST({ version: '9' }).setToken(bot_token);

const body = Object.values(commands).map((command) => command.data.toJSON());

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
