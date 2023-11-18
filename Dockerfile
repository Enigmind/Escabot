FROM node:19.9.0-alpine3.18

WORKDIR /usr/src/bot

COPY package*.json /usr/src/bot/
RUN npm ci --omit dev

COPY . /usr/src/bot/

CMD ["node", "esca.js"]
