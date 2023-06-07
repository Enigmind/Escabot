const { Channel } = require("discord.js");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

function randomResponse() {
  return Math.floor(Math.random() * 200) === 69;
}

module.exports = {
  name: "messageCreate",
  async execute(message) {
    const { author, content, member } = message;

    if (author === client.user) return;

    const channel = client.channels.cache.get(message.channel.id);
    const tag_de_ses_morts =
      client.emojis.resolveIdentifier("831548507990261850");
    const escaDoitIlRepondre = randomResponse();

    if (member.roles.cache.has("831986434373844994")) {
      message.delete();
    }

    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("petite bite")) {
      message
        .react("🥒")
        .then(() => message.react("🤏"))
        .catch(console.error);
    } else if (lowerContent.includes(" bite")) {
      message
        .react("🍆")
        .then(() => message.react("💦"))
        .then(() => message.react("🔞"))
        .catch(console.error);
    }

    async function getContext() {
      let context = [];

      await channel.messages.fetch({ limit: 6 }).then((messages) => {
        messages.forEach((message) => {
          if (message.author === client.user) {
            context.push({ role: "assistant", content: message.content });
          } else {
            context.push({ role: "user", content: message.content });
          }
        });
      });

      context.push({
        role: "system",
        content:
          "Ton nom est Esca. Tu es un robot cynique et sarcastique. Ton but est de répondre aux messages en gardant cet état d'esprit au maximum.",
      });

      // La chaine de message est inversée du au fetch.
      return context.reverse();
    }

    if (content.includes("@everyone")) {
      message.react(tag_de_ses_morts);
    } else if (content.includes("@here")) {
      message.react("🐒");
    } else if (message.mentions.has(client.user.id) || escaDoitIlRepondre) {
      const sendTyping = async () => {
        await message.channel.sendTyping();
      };
      // Esca is typing...
      sendTyping().catch((error) => {
        console.error('Error while typing :', error);
      });
      const typingInterval = setInterval(() => {
        sendTyping().catch((error) => {
          console.error('Error while typing :', error);
        });
      }, 9000);

      const gptResponse = await openai.createChatCompletion({
        model: "gpt-4",
        messages: await getContext(),
        max_tokens: 512,
        temperature: 0.9,
        presence_penalty: 0.5,
        frequency_penalty: 1,
        n: 1,
        stream: false,
      });

      // Stop typing when response is ready
      clearInterval(typingInterval);

      const mes = gptResponse.data.choices[0].message.content;
      message.reply(mes);
    }
  },
};
