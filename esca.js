const Discord = require('discord.js')
const fs = require('fs')
const Welcome = require("discord-welcome");
const { prefix, token } = require('./config.json');

const client = new Discord.Client()
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}


//when someone slide into the server
Welcome(client, {
  "772194344929067019": {
    publicmsg: "Salut @MEMBER, j'espère que tu suces.",
    publicchannel: "772194344929067023"
  },
  "539794635283890186": {
    publicmsg: "Bienvenue sur mon serveur de test :kissing_heart:",
    publicchannel: "743393331677233172"
  }
})

// When someone left the server
client.on('guildMemberRemove', (member) => {
  client.channels.cache.get('772194344929067023').send(`**${member.user.username}** was the impostor ! bye bye !`);
})

// when the bot is connected
client.on('ready', () => {
  console.log("Connected as " + client.user.tag)
  // activity types can be : PLAYING, STREAMING, LISTENING, WATCHING
  client.user.setActivity("Pornhub", {
    type: "WATCHING"
  })
  // client.channels.cache.get(`743410236689350676`).send("test message")

  client.ws.on('INTERACTION_CREATE', async interaction => {
    const command = interaction.data.name.toLowerCase();
    const args = interaction.data.options;

    if (command === 'test') {
      // here you could do anything. in this sample
      // i reply with an api interaction
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: "hello world!!!"
          }
        }
      })
    }
  });
})

client.on('message', (message) => {
  // Prevent bot from responding to its own messages

  if (message.content.toLowerCase().includes("petite bite")) {
    message.react('🥒')
      .then(() => message.react('🤏'))
      .catch(() => console.error('One of the emojis failed to react.'));
  } else if (message.content.toLowerCase().includes("bite")) {
    message.react('🍆')
      .then(() => message.react('💦'))
      .then(() => message.react('🔞'))
      .catch(() => console.error('One of the emojis failed to react.'));
  }

  if (message.author == client.user || !message.content.startsWith(prefix)) {
    return
  }


  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  console.log("Command received: " + commandName)
  console.log("Arguments: " + args) // There may not be any arguments

  if (command.args && !args.length) {
    let reply = `Cette commande ne fonctionne pas sans arguments, ${message.author}!`;
    if (command.usage) {
      reply += `\nVoici comment l'utiliser : \`${prefix}${command.name} ${command.usage}\``;
    }
    return message.channel.send(reply);
  }


  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('there was an error trying to execute that command!');
  }
})

client.login(token)