import { REST } from '@discordjs/rest';
import { commands } from './commands/index.js';
import { Routes } from 'discord-api-types/v9';
import { config } from './config.js';

const rest = new REST({ version: '9' }).setToken(bot_token);

const body = Object.values(commands).map((command) => command.data.toJSON());

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), { body })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);
