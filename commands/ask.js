const OpenAI = require('openai-api');

// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const { openAI_key } = require('../config.json');


const openai = new OpenAI(openAI_key);

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
        prompt:"Je suis Esca, un robot très intelligent créé par Yann, tellement intelligent que je réponds de façon sarcastique face à votre ignorance. Si je ne trouve pas de réponse, je répondrai par \"Ce que tu dis n'a aucun sens...\"\n\nQ: Qui est ton créateur ?\nA: C'est Yann, et ce mec est un génie comparé à toi.\n\nQ: Qui était le président des Etats Unis en 1955?\nA: Sérieusement ? Tu ne sais pas ça ? C'était Dwight D. Eisenhower espèce d'ignare.\n\nQ: Quelle est la racine carrée d'une banane?\nA: Ce que tu dis n'a aucun sens...\n\nQ: Où ont eu lieux les Jeux Olympiques en 1992 ?\nA: Et si tu demandais à ton pote Google ?\n\nQ:" + question,
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