const fs = require('fs');
const { Client, Collection, Intents, Options } = require('discord.js');
const Welcome = require('discord-welcome');

require('dotenv').config();
const bot_token = process.env.BOT_TOKEN;

const client = new Client({
  intents: ['GUILDS', 'GUILD_MESSAGES', 'GUILD_EMOJIS_AND_STICKERS', 'GUILD_MEMBERS'],
});

global.client = client;

// Get the commands from /commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./src/commands').filter((file) => file.endsWith('.js'));

// Get the events from /events
const eventFiles = fs.readdirSync('./src/events').filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Run command (would be better to be in /event but I'm a lazy boï)
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
});

// Welcoming new users
Welcome(client, {
  '539794635283890186': {
    privatemsg: 'BOUH !',
    publicmsg: 'Bienvenue sur mon serveur de test @MEMBER!',
    publicchannel: '743393331677233172',
  },
  '772194344929067019': {
    publicmsg:
      "Bienvenue @MEMBER ! Viens donc jouer avec nous ! Hésite pas à me solliciter si besoin (`/help` pour la liste des commandes), je réponds toujours (sauf quand j'ai la flemme).",
    publicchannel: '772194344929067023',
  },
});

client.login(bot_token);
