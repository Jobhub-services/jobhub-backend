FROM alpine:latest
ARG port
USER root
RUN apk add curl sudo
RUN sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
RUN sudo chmod +x /usr/local/bin/docker-compose

COPY . /staak-api
WORKDIR /staak-api

ENV PORT=$port

RUN sudo docker-compose build

EXPOSE $PORT

CMD sudo docker-compose up -d