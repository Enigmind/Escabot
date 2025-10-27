FROM node:25-alpine3.21

WORKDIR /usr/src/bot

COPY . /usr/src/bot/

RUN npm install -g corepack --force && corepack enable && corepack prepare yarn@stable --activate
RUN yarn --immutable


CMD ["yarn", "esca"]
