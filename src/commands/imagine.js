import { SlashCommandBuilder } from '@discordjs/builders';
import { genAI } from '../helpers/gemini.js';

// use Google Gemini API to generate images (Imagen 4) or videos (Veo 2)
export default {
  data: new SlashCommandBuilder()
    .setName('imagine')
    .setDescription(
      "Je te pond une image ou vidéo en fonction de ce que tu me demandes. C'est pas beau ça ?",
    )
    .addStringOption((option) =>
      option.setName('prompt').setDescription('Que veux-tu générer ?').setRequired(true),
    )
    .addStringOption(option =>
      option.setName('type')
        .setDescription('Image ou vidéo ?')
        .addChoice('Image', 'image')
        .addChoice('Vidéo', 'video')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const userPrompt = interaction.options.getString('prompt');
    const type = interaction.options.getString('type');

    try {
      if (type === 'image') {
        // Générer une image avec Imagen 4
        const model = genAI.getGenerativeModel({
          model: 'veo-3.1-generate-preview'
        });

        const result = await model.generateContent(userPrompt);

        const response = result.response;
        const imagePart = response.candidates[0].content.parts.find(part => part.inlineData);

        if (!imagePart) {
          throw new Error('Aucune image générée');
        }

        const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');

        await interaction.editReply({
          files: [{
            attachment: imageBuffer,
            name: 'generated_image.png'
          }],
        });
      } else {
        // Générer une vidéo avec Veo 2
        const model = genAI.getGenerativeModel({ model: 'veo-2.0-generate-001' });

        const result = await model.generateContent({
          contents: [{
            role: 'user',
            parts: [{ text: userPrompt }]
          }],
          generationConfig: {
            responseModalities: 'video',
          }
        });

        const response = result.response;
        const videoPart = response.candidates[0].content.parts.find(part => part.inlineData);

        if (!videoPart) {
          throw new Error('Aucune vidéo générée');
        }

        const videoBuffer = Buffer.from(videoPart.inlineData.data, 'base64');

        await interaction.editReply({
          files: [{
            attachment: videoBuffer,
            name: 'generated_video.mp4'
          }],
        });
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: `Oups, Gemini pue. Fuck google hein ?`,
      });
    }
  },
};
