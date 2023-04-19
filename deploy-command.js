const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

require("dotenv").config();
const clientId = process.env.CLIENT_ID
const guildId = process.env.GUILD_ID
const bot_token = process.env.BOT_TOKEN

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}
const rest = new REST({ version: '9' }).setToken(bot_token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

// delete command
// rest.delete(Routes.applicationGuildCommand(clientId, guildId, 'commandID'))
// 	.then(() => console.log('Successfully deleted guild command'))
// 	.catch(console.error);