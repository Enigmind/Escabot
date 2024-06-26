import { SlashCommandBuilder } from '@discordjs/builders';
import { openai } from '../helpers/openai.js';

// use openAI api to generate an image according to the prompt
export default {
  data: new SlashCommandBuilder()
    .setName('imagine')
    .setDescription(
      "Je te pond une image en fonction de ce que tu me demandes. C'est pas beau ça ?",
    )
    .addStringOption((option) =>
      option.setName('prompt').setDescription('Que veux-tu générer ?').setRequired(true),
    )
    .addStringOption(option =>
      option.setName('format')
        .setDescription('Quel format pour ton image ?')
        .addChoice('Carré (1:1)', '1024x1024')
        .addChoice('Écran (16:9)', '1792x1024')
        .addChoice('Téléphone (9:16)', '1024x1792')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const userPrompt = interaction.options.getString('prompt');

    try {
      const openaiResponse = await openai.images.generate({
        model: 'dall-e-3',
        prompt: userPrompt,
        n: 1,
        size: interaction.options.getString('format'),
      });

      const imageURL = openaiResponse.data[0].url;
      const image = await fetch(imageURL)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => Buffer.from(arrayBuffer));

      await interaction.editReply({
        files: [image],
      });
    } catch (error) {
      console.error(error);
      const statusCode = error.status;
      await interaction.editReply({
        content: 'https://http.cat/' + statusCode,
      });
    }
  },
};
