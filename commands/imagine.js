const { SlashCommandBuilder } = require("@discordjs/builders");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

// use openAI api to generate an image according to the prompt
module.exports = {
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription(
      "Je te pond une image en fonction de ce que tu me demandes. C'est pas beau ça ?"
    )
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Que veux-tu générer ?")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const user_prompt = interaction.options.getString("prompt");
    const response = await openai.createImage({
      prompt: user_prompt,
      n: 1,
      size: "1024x1024",
    });
    image_url = response['data'][0]['url']
    
    interaction.editReply(image_url)
  },
};
