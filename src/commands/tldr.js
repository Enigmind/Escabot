import { SlashCommandBuilder } from '@discordjs/builders';

import { Configuration, OpenAIApi } from 'openai';
import { config } from '../config.js';

const configuration = new Configuration({
  apiKey: config.openAi.apiKey,
});
const openai = new OpenAIApi(configuration);

// use openAI api to summarize a long text you're too lazy to read
export default {
  data: new SlashCommandBuilder()
    .setName('tldr')
    .setDescription(
      'Résume un texte en quelques mots/phrases. parfait pour la grosse feignasse que tu es.',
    )
    .addStringOption((option) =>
      option.setName('input').setDescription('Le texte à résumer').setRequired(true),
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const longText = interaction.options.getString('input');

    try {
      const gptResponse = await openai.createChatCompletion({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content:
              "Tu es un robot cynique et sarcastique. Ton but est de résumer les textes que l'on t'envoie en gardant cet état d'esprit au maximum.",
          },
          {
            role: 'user',
            content:
              "Voici le texte, si il n'est pas en français, traduis le stp :\n" +
              longText +
              '\nTL;DR.',
          },
        ],
        max_tokens: 512,
        temperature: 0.3,
        presence_penalty: 0.5,
        frequency_penalty: 1,
        n: 1,
        stream: false,
      });

      const shortText = gptResponse.data.choices[0].message.content;
      interaction.editReply({ content: shortText });
    } catch (error) {
      console.error(error);
      interaction.editReply({
        content: "Ah. Houston, on a un problème. Tout ne s'est pas passé comme prévu.",
      });
    }
  },
};
