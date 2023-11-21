import { Configuration, OpenAIApi } from 'openai';
import { config } from '../config.js';

const configuration = new Configuration({
  apiKey: config.openAi.apiKey,
});
const openai = new OpenAIApi(configuration);

function randomResponse() {
  return Math.floor(Math.random() * 200) === 69;
}

export default {
  name: 'messageCreate',
  async execute(message) {
    const { author, content, member } = message;

    if (author === client.user) return;

    const channel = client.channels.cache.get(message.channel.id);
    const tag_de_ses_morts = client.emojis.resolveIdentifier('831548507990261850');
    const escaDoitIlRepondre = randomResponse();

    if (member.roles.cache.has('1098324055389646868')) {
      message.delete();
    }

    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('petite bite')) {
      message
        .react('🥒')
        .then(() => message.react('🤏'))
        .catch(console.error);
    } else if (lowerContent.includes(' bite')) {
      message
        .react('🍆')
        .then(() => message.react('💦'))
        .then(() => message.react('🔞'))
        .catch(console.error);
    }

    async function getContext() {
      let context = [];

      await channel.messages.fetch({ limit: 6 }).then((messages) => {
        messages.forEach((message) => {
          if (message.author === client.user) {
            context.push({ role: 'assistant', content: message.content });
          } else {
            context.push({ role: 'user', content: message.content });
          }
        });
      });

      context.push({
        role: 'system',
        content:
          "Ton nom est Esca. Tu es un robot cynique et sarcastique. Ton but est de répondre aux messages en gardant cet état d'esprit au maximum.",
      });

      // the string is reversed because of the fetch.
      return context.reverse();
    }

    if (content.includes('@everyone')) {
      message.react(tag_de_ses_morts);
    } else if (content.includes('@here')) {
      message.react('🐒');
    } else if (message.mentions.has(client.user.id) || escaDoitIlRepondre) {
      // Définir l'intervalle de frappe
      let typingInterval;

      const sendTyping = async () => {
        await message.channel.sendTyping();
      };

      // Esca is typing...
      sendTyping().catch((error) => {
        console.error('Error while typing :', error);
      });

      typingInterval = setInterval(() => {
        sendTyping().catch((error) => {
          console.error('Error while typing :', error);
        });
      }, 9000);

      const gptResponse = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: await getContext(),
        max_tokens: 512,
        temperature: 0.9,
        presence_penalty: 0.5,
        frequency_penalty: 1,
        n: 1,
        stream: false,
      });

      // Fetch the message content from the GPT response
      const GPTResponse = gptResponse.data.choices[0].message.content;

      // Remove any leading "Ah," or "Oh," interjections from the message, and also trim white spaces at the start and end of the string
      const message_without_interjection = GPTResponse.replace(/^(Ah,|Oh,)/, '').trim();

      // Capitalize the first character of the message and concatenate it with the rest of the message
      const final_message =
        message_without_interjection.charAt(0).toUpperCase() +
        message_without_interjection.slice(1);

      // Send the final message as a reply
      message.reply(final_message);

      // Arrêter l'intervalle de frappe après l'envoi du message
      clearInterval(typingInterval);
    }
  },
};
