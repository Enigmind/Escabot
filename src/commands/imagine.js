import { SlashCommandBuilder } from '@discordjs/builders';
import { genAIMedia } from '../helpers/gemini.js';
import fs from 'fs';

async function fetchAttachmentAsBase64(attachment) {
  if (!attachment.contentType?.startsWith('image/')) {
    throw new Error(`La pièce jointe ${attachment.name} n'est pas une image`);
  }

  const response = await fetch(attachment.url);
  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer).toString('base64');
}

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
        .addChoices({ name: 'Image', value: 'image' }, { name: 'Vidéo', value: 'video' })
        .setRequired(true),
    )
    .addAttachmentOption((option) =>
      option
        .setName('image')
        .setDescription("Première image (référence-la comme 'image 1' dans ton prompt)")
        .setRequired(false),
    )
    .addAttachmentOption((option) =>
      option
        .setName('image2')
        .setDescription("Deuxième image (référence-la comme 'image 2' dans ton prompt)")
        .setRequired(false),
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const userPrompt = interaction.options.getString('prompt');
    const type = interaction.options.getString('type');
    const image1 = interaction.options.getAttachment('image');
    const image2 = interaction.options.getAttachment('image2');

    try {
      if (type === 'image') {
        // Générer/modifier une image avec Gemini, en combinant éventuellement 1 ou 2 images fournies.
        // On numérote juste les images sans présumer de leur rôle (base/ajout) : c'est au prompt
        // de l'utilisateur de dire quoi faire de "l'image 1" et de "l'image 2".
        const promptText =
          image1 && image2
            ? `Voici deux images numérotées : image 1 et image 2. ${userPrompt}`
            : userPrompt;

        const contents = [{ text: promptText }];

        for (const attachment of [image1, image2]) {
          if (!attachment) continue;
          console.log(
            `[imagine] pièce jointe : ${attachment.name}, ${attachment.contentType}, ${attachment.size} octets, ${attachment.width}x${attachment.height}`,
          );
          contents.push({
            inlineData: {
              mimeType: attachment.contentType,
              data: await fetchAttachmentAsBase64(attachment),
            },
          });
        }

        const response = await genAIMedia.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents,
        });

        const candidate = response.candidates?.[0];
        const imagePart = candidate?.content?.parts?.find((part) => part.inlineData);

        if (!imagePart) {
          console.error('[imagine] réponse Gemini sans image :', {
            finishReason: candidate?.finishReason,
            safetyRatings: candidate?.safetyRatings,
            promptFeedback: response.promptFeedback,
          });
          throw new Error(
            candidate?.finishReason
              ? `Gemini a refusé de générer l'image (raison : ${candidate.finishReason})`
              : 'Aucune image générée',
          );
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
        // Générer une vidéo avec Veo 3.1 (à partir d'une image de départ si fournie)
        await interaction.editReply({ content: '🎬 Génération de la vidéo en cours...' });

        const videoParams = {
          model: 'veo-3.1-generate-preview',
          prompt: userPrompt,
          config: {
            aspectRatio: '16:9',
          },
        };

        if (image1) {
          videoParams.image = {
            imageBytes: await fetchAttachmentAsBase64(image1),
            mimeType: image1.contentType,
          };
        }

        let operation = await genAIMedia.models.generateVideos(videoParams);

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
