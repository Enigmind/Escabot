import { SlashCommandBuilder } from '@discordjs/builders';

import OpenAI from 'openai';
import { config } from '../config.js';

const openai = new OpenAI({
  apiKey: config.openAi.apiKey,
});

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
      const gptResponse = await openai.chat.completions.create({
        model: 'gpt-4-1106-preview',
        messages: [
          {
            role: 'system',
            content:
              "Tu es un robot cynique. Ton but est de résumer les textes que l'on t'envoie en gardant cet état d'esprit au maximum. Exprime toi comme si tu t'adressais à un enfant. Ton résumé doit être court. Le plus court possible.",
          },
          {
            role: 'user',
            content:
              "Voici le texte, si il n'est pas en français, traduis le :\n" +
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

      const shortText = gptResponse.choices[0].message.content;
      interaction.editReply({ content: shortText });
    } catch (error) {
      console.error(error);
      interaction.editReply({
        content: "Ah. Houston, on a un problème. Tout ne s'est pas passé comme prévu.",
      });
    }
  },
};
