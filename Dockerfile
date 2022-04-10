FROM node:14.15.4-alpine

ARG port
USER root
COPY . /staak-api
WORKDIR /staak-api

ENV PORT=$port

RUN npm install pm2 -g

RUN npm install

WORKDIR /staak-api/user-service
RUN npm install
RUN npm run build

WORKDIR /staak-api/staak-gateway
RUN npm install

WORKDIR /staak-api

ENV GATEWAY_PORT=$PORT
ENV LOG_LEVEL=debug

EXPOSE $PORT

CMD pm2 start user-service/dist/index.js && npm run start:app