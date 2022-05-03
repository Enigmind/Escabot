const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require('discord.js');
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("urban_dic")
    .setDescription("Donne la définition d'un terme anglophone")
    .addStringOption((option) =>
      option
        .setName("terme")
        .setDescription("Le mot/expression à chercher")
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.deferReply();
    const term = interaction.options.getString("terme");
    const query = new URLSearchParams({ term });

    const { list } = await fetch(
      `https://api.urbandictionary.com/v0/define?${query}`
    ).then((response) => response.json());

    if (!list.length) {
      return interaction.editReply(`Aucun résultat trouvé pour : **${term}**.`);
    }

    const [answer] = list;

    const embed = new MessageEmbed()
      .setColor("#EFFF00")
      .setTitle(answer.word)
      .setURL(answer.permalink)
      .addFields(
        { name: "Definition", value: answer.definition },
        { name: "Example", value: answer.example },
        {
          name: "Rating",
          value: `${answer.thumbs_up} thumbs up. ${answer.thumbs_down} thumbs down.`,
        }
      );
    interaction.editReply({ embeds: [embed] });
  },
};
