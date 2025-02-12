FROM node:23.7.0-alpine3.20

WORKDIR /usr/src/bot

COPY package*.json /usr/src/bot/
RUN yarn install --immutable

COPY . /usr/src/bot/

CMD ["node", "src/esca.js"]
