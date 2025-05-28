FROM node:23.7.0-alpine3.20

WORKDIR /usr/src/bot

COPY . /usr/src/bot/

RUN corepack enable && corepack prepare yarn@stable --activate
RUN yarn --immutable


CMD ["yarn", "esca"]
