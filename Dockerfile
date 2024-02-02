FROM node:21.5.0-alpine3.18

WORKDIR /usr/src/bot

COPY package*.json /usr/src/bot/
RUN yarn install --immutable

COPY . /usr/src/bot/

CMD ["node", "src/esca.js"]
