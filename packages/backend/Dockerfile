FROM node:23-alpine

WORKDIR /app

COPY ./package.json .
RUN npm i

COPY ./tsconfig.json .
COPY ./src src
RUN npm run build

ENV NODE_ENV=production

ENTRYPOINT ["node", "build/index.js"]
