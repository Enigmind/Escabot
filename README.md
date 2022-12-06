# Esca Bot
## Description :
Useless sarcastic bot. But can be fun sometimes..

## Requirements :
- NodeJS 16.6 or higher (https://nodejs.org/en/download/package-manager/)
- Docker (https://docs.docker.com/engine/install/)
- Access to OpenAI API (create an account [here](https://beta.openai.com/signup))

## Setup dev environment :
- clone the git repository : `git clone git@github.com:Enigmind/Escabot.git`
- install dependances : `npm install`
- rename the file `example.env` to `.env`
- enter the clientId in the `.env` (get it [here](https://discord.com/developpers))
- enter your bot guild ID in the `.env` (copy it from discord client with dev options activated)
- enter your bot token in the `.env` (get it [here](https://discord.com/developpers))
- enter your openAI key in the `.env` (get it [here](https://beta.openai.com/account/api-keys))
- deploy the commands into your server : `node deploy-commands.js`
- launch bot in terminal : `node esca.js`
- write the help command in a discord channel : `/help`


## Prod :
- build the docker image : `docker build -t esca-bot .`

(if you wanna run the bot on a raspberry pi, change the base image in the dockerfile into `arm32v6/node:16-alpine`)

- run the container : `docker run -d esca-bot`
