const { SlashCommandBuilder } = require("@discordjs/builders");
const fetch = require("node-fetch");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("pussy")
    .setDescription("Petit coquinou va..."),
  async execute(interaction) {
    await interaction.deferReply();
    const { file } = await fetch("https://aws.random.cat/meow").then(
      (response) => response.json()
    );
    interaction.editReply({ files: [file] });
  },
};
