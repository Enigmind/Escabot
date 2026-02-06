import { SlashCommandBuilder } from '@discordjs/builders';
import { genAIMedia } from '../helpers/gemini.js';
import fs from 'fs';

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
    .addStringOption((option) =>
      option
        .setName('type')
        .setDescription('Image ou vidéo ?')
        .addChoice('Image', 'image')
        .addChoice('Vidéo', 'video')
        .setRequired(true),
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const userPrompt = interaction.options.getString('prompt');
    const type = interaction.options.getString('type');

    try {
      if (type === 'image') {
        // Générer une image avec Imagen 4
        const response = await genAIMedia.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: userPrompt,
        });

        const imagePart = response.candidates[0].content.parts.find((part) => part.inlineData);

        if (!imagePart) {
          throw new Error('Aucune image générée');
        }

        const imageBuffer = Buffer.from(imagePart.inlineData.data, 'base64');

        await interaction.editReply({
          files: [
            {
              attachment: imageBuffer,
              name: 'generated_image.png',
            },
          ],
        });
      } else {
        // Générer une vidéo avec Veo 3.1
        await interaction.editReply({ content: '🎬 Génération de la vidéo en cours...' });

        let operation = await genAIMedia.models.generateVideos({
          model: 'veo-3.1-generate-preview',
          prompt: userPrompt,
          config: {
            aspectRatio: '16:9',
          },
        });

        // Poll l'opération jusqu'à ce que la vidéo soit prête
        while (!operation.done) {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          operation = await genAIMedia.operations.getVideosOperation({
            operation: operation,
          });
        }

        // Télécharger la vidéo générée dans un fichier temporaire
        const tempPath = `/tmp/generated_video_${Date.now()}.mp4`;
        await genAIMedia.files.download({
          file: operation.response.generatedVideos[0].video,
          downloadPath: tempPath,
        });

        // Envoyer la vidéo à Discord
        await interaction.editReply({
          content: '✅ Vidéo générée !',
          files: [
            {
              attachment: tempPath,
              name: 'generated_video.mp4',
            },
          ],
        });

        // Nettoyer le fichier temporaire
        fs.unlinkSync(tempPath);
      }
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: `Oups, Gemini pue. Fuck google hein ?`,
      });
    }
  },
};
