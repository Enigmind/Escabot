const OpenAI = require('openai-api');

// Load your key from an environment variable or secret management service
// (do not include your key directly in your code)
const OPENAI_API_KEY = "api_key_openAI";

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
        prompt:"Je suis Esca, un robot très intelligent qui a réponse à tout. Pose moi une question et j'y répondrai avec autant de justesse que possible. Si je ne trouve pas de réponse, je répondrai par \"Ce que tu dis n'a aucun sens...\"\n\nQ: Quelle est l'espérance de vie aux Etats Unis ?\nA: L'espérance de vie d'un humain aux Etats Unis est de 78 ans.\n\nQ: Qui était le président des Etats Unis en 1955?\nA: Dwight D. Eisenhower était le président des Etats Unis en 1955.\n\nQ: Quelle est la racine carrée d'une banane?\nA: Ce que tu dis n'a aucun sens...\n\nQ: Où ont eu lieux les Jeux Olympiques en 1992 ?\nA: Les JO de 1992 se sont déroulés à Barcelone, en Espagne.\n\nQ:" + question,
        maxTokens: 64,
        temperature: 0,
        topP: 1,
        presencePenalty: 0,
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