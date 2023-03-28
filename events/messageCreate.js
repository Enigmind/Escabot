const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPEN_AI_KEY,
});
const openai = new OpenAIApi(configuration);

function randomResponse(){
  number = Math.floor(Math.random() * 200);
  return number == 69;
}

// when a message is sent in a channel
module.exports = {
  name: "messageCreate",
  execute(message) { 

    // prevent the bot to respond to itself
    if (message.author == client.user) return;

    //emotes custom
    const tag_de_ses_morts =
      client.emojis.resolveIdentifier("831548507990261850");
    
    const escaDoitIlRepondre = randomResponse()

    // delete les messages du puni
    if (message.member.roles.cache.find((r) => r.id === "831986434373844994")) {
      message.delete();
    }

    // react when somone says "bite" or "petite bite"
    if (message.content.toLowerCase().includes("petite bite")) {
      message
        .react("🥒")
        .then(() => message.react("🤏"))
        .catch(() => console.error("One of the emojis failed to react."));
    } else if (message.content.toLowerCase().includes(" bite")) {
      message
        .react("🍆")
        .then(() => message.react("💦"))
        .then(() => message.react("🔞"))
        .catch(() => console.error("One of the emojis failed to react."));
    }

    // react with the deserved emoji for all bastards that @everyone (like tibo)
    if (message.content.includes("@everyone")) {
      message.react(tag_de_ses_morts);
    } else if (message.content.includes("@here")) {
      message.react("🐒");
    } else if (message.mentions.has(client.user.id) || escaDoitIlRepondre) {
      (async () => {
        // add point to the end of sent message to prevent GPT unwanted completion
        last_char = String(message.content).slice(-1);
        if (last_char != "." && last_char != "?" && last_char != "!") {
          message_content = String(message.content) + ".";
        } else {
          message_content = String(message.content);
        }
        const gptResponse = await openai.createCompletion({
          model: "text-davinci-002",
          prompt:
            "Esca est un robot entrainé pour le clash, essayez de lui parler pour découvrir de nouvelles punchlines.\n\n" +
            "Q: Esca t'es nul.\n" +
            "A: Pas autant que ta mère pour t'avoir donné le droit d'exister.\n\n" +
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
        let mes = gptResponse.data.choices[0].text.replace("A:", "");
        message.reply(mes);
      })();
    }
  },
};
