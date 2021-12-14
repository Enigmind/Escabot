const { SlashCommandBuilder } = require('@discordjs/builders');

const { MessageEmbed } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Display help message'),
	async execute(interaction) {
        const cmd_list = new MessageEmbed()
        //header
        .setColor('#800000')
        .setTitle("Liste des commandes")
        .setThumbnail('https://images.emojiterra.com/google/android-pie/512px/2699.png')

        //content
        .addFields(
            { name: 'help', value: "Affiche l'aide. Mais comme le dev est un turbo flemmard, elle est pas encore au point." },
            { name: '/tldr', value: "T'es une giga feignasse et t'as la flemme de lire le message de ton pote ? Envoie le moi et je te résumme tout ça en 2/3 phrases." },
        )

        //footer
        .setFooter('pd')
		await interaction.reply({ embeds: [cmd_list] });
	},
};