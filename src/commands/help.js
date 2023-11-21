import { SlashCommandBuilder } from '@discordjs/builders';

import { MessageEmbed } from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('help').setDescription('Display help message'),
  async execute(interaction) {
    const cmd_list = new MessageEmbed()
      //header
      .setColor('#800000')
      .setTitle('Liste des commandes')
      .setThumbnail('https://images.emojiterra.com/google/android-pie/512px/2699.png')

      //content
      .addFields(
        {
          name: 'help',
          value:
            "Affiche l'aide. Mais comme le dev est un turbo flemmard, elle est pas encore au point.",
        },
        {
          name: 'imagine',
          value: "Génère une image. Demande moi n'importe quoi et laisse toi suprendre !",
        },
        { name: 'tldr', value: 'Résume un texte long. Parfait pour la feignasse que tu es !' },
        {
          name: 'urban_dic',
          value:
            "Donne la définition d'un terme anglophone. La réponse est en anglais par contre. Si tu comprends tant mieux, sinon tant pis.",
        },
        { name: 'pussy', value: 'Petit coquinou va... 😏' },
        {
          name: 'Sinon tu peux me tag pour me parler',
          value: 'Je répondrai dans la mesure du possible.',
        },
      );
    await interaction.reply({ embeds: [cmd_list] });
  },
};
