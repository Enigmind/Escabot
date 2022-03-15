FROM node:latest

WORKDIR /usr/src/bot

COPY package*.json /usr/src/bot/
RUN npm ci

COPY . /usr/src/bot/

# deploy/updates slash commands
# RUN node deploy-command.js

ENV CLIENT_ID="589466442961911840"
ENV GUILD_ID="864251715691085825"
ENV BOT_TOKEN="NTg5NDY2NDQyOTYxOTExODQw.XQUFZw.Y6gWCglqyEBVYdf1_POCTW59teE"
ENV OPEN_AI_KEY="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"


CMD ["node", "esca.js"]
