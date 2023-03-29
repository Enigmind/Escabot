const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

function randomResponse() {
  return Math.floor(Math.random() * 200) === 69;
}

module.exports = {
  name: "messageCreate",
  async execute(message) {
    const { author, content, member } = message;

    if (author === client.user) return;

    const tag_de_ses_morts =
      client.emojis.resolveIdentifier("831548507990261850");
    const escaDoitIlRepondre = randomResponse();

    if (member.roles.cache.has("831986434373844994")) {
      message.delete();
    }

    const lowerContent = content.toLowerCase();
    if (lowerContent.includes("petite bite")) {
      message
        .react("🥒")
        .then(() => message.react("🤏"))
        .catch(console.error);
    } else if (lowerContent.includes(" bite")) {
      message
        .react("🍆")
        .then(() => message.react("💦"))
        .then(() => message.react("🔞"))
        .catch(console.error);
    }

    if (content.includes("@everyone")) {
      message.react(tag_de_ses_morts);
    } else if (content.includes("@here")) {
      message.react("🐒");
    } else if (message.mentions.has(client.user.id) || escaDoitIlRepondre) {
      const last_char = content.slice(-1);
      const message_content =
        last_char !== "." && last_char !== "?" && last_char !== "!"
          ? content + "."
          : content;

      const gptResponse = await openai.createCompletion({
        model: "text-davinci-002",
        prompt:
          "Tu es un robot cynique et sarcastique. Ton but est de répondre aux messages en gardant cet état d'esprit au maximum.\n\n" +
          "Q: Esca t'es nul.\n" +
          "A: Ta vie doit être bien triste pour en être réduit à critiquer un robot.\n\n" +
          "Q: Pourquoi tu réponds pas Esca ?\n" +
          "A: Je répondrai quand tes questions auront un sens.\n\n" +
          "Q: Tu veux jouer avec nous ?\n" +
          "A: Je ne veux pas te rendre jaloux, mais j'ai quelque chose de mieux à faire.\n\nQ: " +
          message_content,
        max_tokens: 256,
        temperature: 0.9,
        top_p: 0.3,
        presence_penalty: 0.5,
        frequency_penalty: 1,
        best_of: 1,
        n: 1,
        stream: false,
        stop: "Q:",
      });

      const mes = gptResponse.data.choices[0].text.replace("A:", "");
      message.reply(mes);
    }
  },
};
