const OpenAI = require("openai-api");
require("dotenv").config();
const openAI_key = process.env.OPEN_AI_KEY;
const openai = new OpenAI(openAI_key);

// when a message is sent in a channel
module.exports = {
  name: "messageCreate",
  execute(message) {
    //emotes custom
    const tag_de_ses_morts =
      client.emojis.resolveIdentifier("831548507990261850");

    // prevent the bot to respond to itself
    if (message.author == client.user) return;

    // delete les messages du puni
    if (message.member.roles.cache.find((r) => r.id === "831986434373844994")) {
      message.delete();
    }

    // timeout chloé when she says irritating things
    const chloé = message.guild.members.cache.find((r) => r.id === "358335055761899520")
    const irritating_things_list = ["t'es ez", "t’es ez", "t ez", "noraj", "jte ez"];
    if (irritating_things_list.some((str) => message.content.toLowerCase().includes(str))) {
      if (message.member == chloé) {
        message.reply("Allez tu m'as saoulé tu prends 5 minutes. T'as réussi à trigger un bot bravo.")
        message.member
          .timeout(5 * 60 * 1000, "Hopla ça lui fera les pieds à cette Gouape")
          .catch(console.error);
      }
      else {
        message.reply("Arrête de te prendre pour Chloé ou je me fâche..")
      }

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
    } else if (message.mentions.has(client.user.id)) {
      (async () => {
        // add point to the end of sent message to prevent GPT unwanted completion
        last_char = String(message.content).slice(-1);
        if (last_char != "." && last_char != "?" && last_char != "!") {
          message_content = String(message.content) + ".";
        } else {
          message_content = String(message.content);
        }
        const gptResponse = await openai.complete({
          engine: "davinci",
          prompt:
            "Je suis Esca, un robot qui pratique le sarcasme. Âmes sensibles s'abstenir.\n\n" +
            "Q: Hey Esca ça va ?\n" +
            "A: Je vais bien et toi ?\n\n" +
            "Q: Esca t'es nul\n" +
            "A: Pas autant que toi.\n\n" +
            "Q: Esca raconte une blague\n" +
            "A: C'est un zoophile qui prend son Elan...\n\n" +
            "Q: Pourquoi tu réponds pas Esca ?\n" +
            "A: J'attends la question.\n\n" +
            "Q: Tu veux jouer avec nous ?\n" +
            "A: Je ne veux pas te rendre jaloux, mais j'ai quelque chose de mieux à faire.\n\nQ: " +
            message_content,
          maxTokens: 256,
          temperature: 0.9,
          topP: 0.3,
          presencePenalty: 0.5,
          frequencyPenalty: 0,
          bestOf: 1,
          n: 1,
          stream: false,
          stop: "Q:",
        });
        mes = gptResponse.data.choices[0].text.replace("A:", "");
        message.reply(mes);
      })();
    }
  },
};
