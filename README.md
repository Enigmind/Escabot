# Bot Anick
## Description :
Useless bot for AMONG SUS

## Invite Link :
https://discordapp.com/oauth2/authorize?client_id=589466442961911840&scope=bot&permissions=8

## Requirements :
- NodeJS 12.x mini (https://nodejs.org/en/download/package-manager/)
- Docker (https://docs.docker.com/engine/install/)
## Setup dev environment :
- clone the git repository : `git clone https://github.com/Enigmind/Bot-VK.git`
- install dependances : `npm install`
- rename the file `config-example.json` to `config.json`
- enter your bot token in the `config.json` file and change the prefix if you want.
- launch bot in terminal : `node esca.js`
- write the help command in a discord channel : `§help`


## Prod :
- build the docker image : `docker build -t esca-bot .`

(if you wanna run the bot on a raspberry pi, change the base image in the dockerfile into `arm32v6/node:14-alpine`)

- run the container : `docker run -d esca-bot`