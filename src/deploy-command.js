import fs from 'fs';
import { REST } from '@discordjs/rest';

import { Routes } from 'discord-api-types/v9';
import { config } from './config.js';

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const { default: command } = await import(`./commands/${file}`);
  commands.push(command.data.toJSON());
}
const rest = new REST({ version: '9' }).setToken(config.discord.botToken);

rest
  .put(Routes.applicationGuildCommands(config.discord.clientId, config.discord.guildId), {
    body: commands,
  })
  .then(() => console.log('Successfully registered application commands.'))
  .catch(console.error);

// delete command
// rest.delete(Routes.applicationGuildCommand(clientId, guildId, 'commandID'))
// 	.then(() => console.log('Successfully deleted guild command'))
// 	.catch(console.error);
