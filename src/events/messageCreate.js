import { mistral } from '../helpers/mistral.js';
import { config } from '../config.js';
function randomResponse() {
  return Math.floor(Math.random() * 200) === 69;
}

const promptEsca = config.discord.promptEsca;

export default {
  name: 'messageCreate',
  async execute(message) {
    const { author, content, member } = message;

    if (author === client.user) return;

    const channel = client.channels.cache.get(message.channel.id);
    const tagEmoji = client.emojis.resolveIdentifier('831548507990261850');
    const shouldRespond = randomResponse();

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

      await channel.messages.fetch({ limit: 42 }).then((messages) => {
        messages.forEach((message) => {
          if (message.author === client.user) {
            context.push({ role: 'assistant', content: message.content });
          } else {
            if (message.attachments.size > 0) {
              const attachment = message.attachments.first();
              context.push({
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: 'message envoyé par : <@' + message.author.id + '>\n' + message.content,
                  },
                  {
                    type: 'image_url',
                    image_url: attachment.url,
                  },
                ],
              });
            } else {
              context.push({
                role: 'user',
                content: 'message envoyé par : <@' + message.author.id + '>\n' + message.content,
              });
            }
          }
        });
      });

      context.push({
        role: 'system',
        content: promptEsca,
      });

      // the string is reversed because of the fetch.
      return context.reverse();
    }

    if (content.includes('@everyone')) {
      await message.react(tagEmoji);
    } else if (content.includes('@here')) {
      await message.react('🐒');
    } else if (message.mentions.has(client.user.id) || shouldRespond) {
      // Define the typing interval
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

      try {
        const gptResponse = await mistral.chat.complete({
          model: 'mistral-large-latest',
          messages: await getContext(),
          maxTokens: 512,
          temperature: 0.9,
        });

        // Fetch the message content from the Mistral response
        const GPTResponse = gptResponse.choices[0].message.content;

        // Remove any leading "Ah," or "Oh," interjections from the message, and also trim whitespaces at the start and end of the string
        const messageWithInterjection = GPTResponse.replace(/^(Ah,|Oh,)/, '').trim();

        // Capitalize the first character of the message and concatenate it with the rest of the message

        const finalMessage =
          messageWithInterjection.charAt(0).toUpperCase() + messageWithInterjection.slice(1);

        // Send the final message as a reply
        message.reply(finalMessage);

        // Stop the interval after sending the message
        clearInterval(typingInterval);
      } catch (error) {
        console.error(error);
        const statusCode = error.status;
        message.reply({
          content: 'https://http.cat/' + statusCode,
        });
        clearInterval(typingInterval);
      }
    }
  },
};
