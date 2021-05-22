const apiEndpoint = 'https://discord.com/api/v8/applications/589466442961911840/commands'
const botToken = 'NTg5NDY2NDQyOTYxOTExODQw.XQUFZw.W-RvxtC2zFb1sgU5i04c0LPA0xc'
const commandData = {
    "name": "ask",
    "description": "ask Esca anything, he'll try his best to respond",
    "options": [
        {
            "name": "question",
            "description": "question you want to ask.",
            "type": 3,
            "required": true,
        },
    ]
  }

async function main () {
  const fetch = require('node-fetch')

  const response = await fetch(apiEndpoint, {
    method: 'post',
    body: JSON.stringify(commandData),
    headers: {
      'Authorization': 'Bot ' + botToken,
      'Content-Type': 'application/json'
    }
  })
  const json = await response.json()

  console.log(json)
}
main()