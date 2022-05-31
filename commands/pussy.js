const { SlashCommandBuilder, MessageAttachment } = require("@discordjs/builders");
const fetch = require("node-fetch");


module.exports = {
  data: new SlashCommandBuilder()
    .setName("pussy")
    .setDescription("Petit coquinou va..."),
  async execute(interaction) {
    await interaction.deferReply();
    try {
      const { file } = await fetch("https://aws.random.cat/meow").then(
        (response) => response.json()
      );
      interaction.editReply({ files: [file] });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "Pas de poti chat trouvé..",
        ephemeral: false,
        files: ['images/404.jpeg']
      });
    }
  },
};
