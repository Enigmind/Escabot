const Discord = require("discord.js");
const fs = require("fs");
const Welcome = require("discord-welcome");
const { prefix, token } = require("./config.json");

const OpenAI = require("openai-api");

const { openAI_key } = require("./config.json");
const openai = new OpenAI(openAI_key);


const client = new Discord.Client();
client.commands = new Discord.Collection();

global.client = client;

const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

//when someone slide into the server
Welcome(client, {
  "772194344929067019": {
    publicmsg: "Bienvenue à toi @MEMBER, Viens donc jouer avec nous !",
    publicchannel: "772194344929067023",
  },
});

// When someone left the server
client.on("guildMemberRemove", (member) => {
  client.channels.cache
    .get("772194344929067023")
    .send(
      `**${member.user.username}** was ejected ! He was an Impostor ! \n<:fine:785276116558151690>`
    );
});

// when the bot is connected
client.on("ready", () => {
  console.log("Connected as " + client.user.tag);
  // activity types can be : PLAYING, STREAMING, LISTENING, WATCHING
  client.user.setActivity("Pornhub", {
    type: "WATCHING",
  });
  // client.channels.cache.get(`787364293095456788`).send("")
  // general = client.channels.cache.get('772194344929067023')
  // among = client.channels.cache.get('787364293095456788')
  // among.fetch('831979167041060894').react('❤️')

  client.ws.on("INTERACTION_CREATE", async (interaction) => {
    if (!client.commands.has(interaction.data.name)) return;
    try {
      client.commands.get(interaction.data.name).execute(interaction);
      // console.log(interaction.data.options[0].value)
    } catch (error) {
      console.log(
        `Error from command ${interaction.data.name} : ${error.message}`
      );
      console.log(`${error.stack}\n`);
      client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
          type: 4,
          data: {
            content: `Oups, une erreur s'est produite !`,
          },
        },
      });
    }
  });
});

client.on("message", (message) => {
  //emotes custom
  const tag_de_ses_morts =
    client.emojis.resolveIdentifier("831548507990261850");
  const impo = client.emojis.resolveIdentifier("831235278822965290");

  // prevent the bot to respond to itself
  if (message.author == client.user) return;

  // delete les messages du puni
  if (message.member.roles.cache.find((r) => r.id === "831986434373844994")) {
    message.delete();
  }

  // react when somone says "bite" or "petite bite"
  if (message.content.toLowerCase().includes("petite bite")) {
    message
      .react("🥒")
      .then(() => message.react("🤏"))
      .catch(() => console.error("One of the emojis failed to react."));
  } else if (message.content.toLowerCase().includes("bite")) {
    message
      .react("🍆")
      .then(() => message.react("💦"))
      .then(() => message.react("🔞"))
      .catch(() => console.error("One of the emojis failed to react."));
  }

  // react with the deserved emoji for all bastards that @everyone (like tibo)
  if (message.content.includes("@everyone")) {
    message.react(tag_de_ses_morts);
    message.react("🤬");
    message.react("💢");
    message.react(impo);
  } else if (message.content.includes("@here")) {
    message.react("🐒");
  } else if (message.mentions.has(client.user.id)) {
      (async () => {
        const gptResponse = await openai.complete({
          engine: "davinci",
          prompt:
            "Je suis Esca, et je réponds quand on me sollicite. Demandez moi n'importe quoi et je répondrai. Si je ne comprends pas, je répondrai 'Plaît-il ?'\n\n"+
            "Q: Esca\n"+
            "A: Plaît-il ?\n\n"+
            
            "Q: Hey Esca ça va ?\n"+
            "A: Je vais bien et toi ?\n\n"+
            
            "Q: Esca t'es nul\n"+
            "A: Pas autant que toi.\n\n"+
            
            "Q: Esca raconte une blague\n"+
            "A: C'est un zoophile qui prend son Elan...\n\n"+
            
            "Q: Pourquoi tu réponds pas Esca ?\n"+
            "A: J'attends la question.\n\n"+
            
            "Q: Tu veux jouer avec nous ?\n"+
            "A: Je ne veux pas te rendre jaloux, mais j'ai quelque chose de mieux à faire.\n\nQ: "+
            
            String(message.content),
          maxTokens: 64,
          temperature: 0.9,
          topP: 0.3,
          presencePenalty: 0.5,
          frequencyPenalty: 0,
          bestOf: 1,
          n: 1,
          stream: false,
          stop: "Q:",
        });
        mes = gptResponse.data.choices[0].text.replace("A:","")
        message.reply(mes);
      }
    )();
  }

  if (!message.content.startsWith(prefix)) {
    return;
  }

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  console.log("Command received: " + commandName);
  console.log("Arguments: " + args); // There may not be any arguments

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
    message.reply("there was an error trying to execute that command!");
  }
});

client.login(token);
