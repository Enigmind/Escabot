import fetch from 'node-fetch';
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
  data: new SlashCommandBuilder().setName('pussy').setDescription('Petit coquinou va...'),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      // Fetch the cat image
      const response = await fetch('https://cataas.com/cat');
      
      if (!response.ok) throw new Error('Network response was not ok');

      // Extract the image buffer
      const buffer = await response.buffer();
      
      // Send the image to Discord
      const attachment = {
        attachment: buffer,
        name: 'cat.jpg'
      };

      await interaction.editReply({ files: [attachment] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: 'https://http.cat/599',
      });
    }
  },
};
