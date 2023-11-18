const { SlashCommandBuilder } = require("@discordjs/builders");
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

// use openAI api to summarize a long text you're too lazy to read
module.exports = {
  data: new SlashCommandBuilder()
    .setName("tldr")
    .setDescription(
      "Résume un texte en quelques mots/phrases. parfait pour la grosse feignasse que tu es."
    )
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("Le texte à résumer")
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const long_text = interaction.options.getString("input");

    try {
        const gptResponse = await openai.createChatCompletion({
            model: "gpt-4",
            messages: [
              {"role": "system", "content": "Tu es un robot cynique et sarcastique. Ton but est de résumer les textes que l'on t'envoie en gardant cet état d'esprit au maximum."},
              {"role": "user", "content": "Voici le texte, si il n'est pas en français, traduis le stp :\n" + long_text + "\nTL;DR."},
            ],
            max_tokens: 512,
            temperature: 0.3,
            presence_penalty: 0.5,
            frequency_penalty: 1,
            n: 1,
            stream: false,
          });

          const short_text = gptResponse.data.choices[0].message.content;
      interaction.editReply({ content: short_text });
    } catch (error) {
      console.error(error);
      interaction.editReply({
        content: "Ah. Houston, on a un problème. Tout ne s'est pas passé comme prévu.",
      });
    }
  },
};