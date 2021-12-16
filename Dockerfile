FROM node:latest

WORKDIR /usr/src/bot

COPY package*.json /usr/src/bot/
RUN npm ci

COPY . /usr/src/bot/

# deploy/updates slash commands
RUN node deploy-command.js

CMD ["node", "esca.js"]
