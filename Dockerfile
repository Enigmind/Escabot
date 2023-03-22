FROM node:19-alpine

WORKDIR /usr/src/bot

COPY package*.json /usr/src/bot/
RUN npm ci

COPY . /usr/src/bot/

CMD ["node", "esca.js"]
