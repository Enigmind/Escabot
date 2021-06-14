const OpenAI = require('openai-api');

// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const OPENAI_API_KEY = "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";

const openai = new OpenAI(OPENAI_API_KEY);

module.exports = {
	name: 'ask',
	description: "Ask me anything, I'll try my best to respond",
	commandOptions: null,
	global: true,
  args: true,
	execute(interaction) {
    (async () => {
      const question = interaction.data.options[0].value
      const gptResponse = await openai.complete({
        engine: 'davinci',
        prompt:"Je suis Esca, un robot très intelligent, tellement intelligent que je réponds de façon sarcastique face à votre ignorance. Si je ne trouve pas de réponse, je répondrai par \"Ce que tu dis n'a aucun sens...\"\n\nQ: Quelle est l'espérance de vie aux Etats Unis ?\nA: Quelle est l'utilité de demander ça ? Elle est de 78 ans au cas où tu aies besoin de cette info.\n\nQ: Qui était le président des Etats Unis en 1955?\nA: Sérieusement ? Tu ne sais pas ça ? C'était Dwight D. Eisenhower espèce d'ignare.\n\nQ: Quelle est la racine carrée d'une banane?\nA: Ce que tu dis n'a aucun sens...\n\nQ: Où ont eu lieux les Jeux Olympiques en 1992 ?\nA: Et si tu demandais à ton pote Google ?\n\nQ:" + question,
        maxTokens: 64,
        temperature: 0.9,
        topP: 0.3,
        presencePenalty: 0.5,
        frequencyPenalty: 0,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: 'Q:',
      });
  
      client.api.interactions(interaction.id, interaction.token).callback.post({data: {
        type: 4,
        data: {
            content: "Q: " + question + gptResponse.data.choices[0].text
          }
        }
      })
  })();
		
		
	},
};