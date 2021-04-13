const apiEndpoint = 'https://discord.com/api/v8/applications/589466442961911840/guilds/539794635283890186/commands'
const botToken = 'NTg5NDY2NDQyOTYxOTExODQw.XQUFZw.gq9GrVkpykl9C_A_xRILD_hWzuI'
const commandData = {
    "name": "test",
    "description": "test command",
    "options": [
        {
            "name": "string",
            "description": "string to test",
            "type": 3,
            "required": false,
            "choices": [
                {
                    "name": "Magellanic",
                    "value": "magellanic"
                },
                {
                    "name": "Emperor",
                    "value": "emperor"
                },
                {
                    "name": "Chinstrap",
                    "value": "chinstrap"
                },
                {
                    "name": "Gentoo",
                    "value": "gentoo"
                }
            ]
        },
        {
            "name": "role",
            "description": "role to test",
            "type": 8,
            "required": false
        }
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