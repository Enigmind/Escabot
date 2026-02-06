import { genAI } from '../helpers/gemini.js';
import { config } from '../config.js';

function randomResponse() {
  return Math.floor(Math.random() * 200) === 69;
}

async function fetchImageAsBase64(url) {
  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64');
  } catch (error) {
    console.error('Error fetching image:', error);
    return null;
  }
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

    if (member && member.roles.cache.has('1098324055389646868')) {
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
      const messages = await channel.messages.fetch({ limit: 33 });

      for (const message of messages.values()) {
        if (message.author === client.user) {
          context.push({ role: 'model', parts: [{ text: message.content }] });
        } else {
          const parts = [
            { text: 'message envoyé par : <@' + message.author.id + '>\n' + message.content },
          ];

          if (message.attachments.size > 0) {
            const attachment = message.attachments.first();
            // Check if the attachment is an image (including GIFs)
            const isImage =
              attachment.contentType?.startsWith('image/') ||
              /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.url);

            if (isImage) {
              // Fetch and convert the image to base64 for Gemini
              const base64Data = await fetchImageAsBase64(attachment.url);
              if (base64Data) {
                parts.push({
                  inlineData: {
                    mimeType: attachment.contentType || 'image/jpeg',
                    data: base64Data,
                  },
                });
              }
            }
          }

          context.push({
            role: 'user',
            parts: parts,
          });
        }
      }

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
        const model = genAI.getGenerativeModel({
          model: 'gemini-2.5-flash',
          systemInstruction: promptEsca,
          generationConfig: {
            maxOutputTokens: 5096,
            temperature: 0.9,
          },
        });

        const chat = model.startChat({
          history: await getContext(),
        });

        const result = await chat.sendMessage('');

        // Fetch the message content from the Gemini response
        const GPTResponse = result.response.text();

        // Capitalize the first character of the message
        const finalMessage = GPTResponse.charAt(0).toUpperCase() + GPTResponse.slice(1);

        // Send the final message as a reply
        message.reply(finalMessage);

        // Stop the interval after sending the message
        clearInterval(typingInterval);
      } catch (error) {
        // Safely log error without causing inspect issues
        console.error('Error in Gemini API call:', {
          message: error?.message,
          status: error?.status,
          statusText: error?.statusText,
        });
        const statusCode = error?.status || 500;
        message.reply({
          content: 'https://http.cat/' + statusCode,
        });
        clearInterval(typingInterval);
      }
    }
  },
};
