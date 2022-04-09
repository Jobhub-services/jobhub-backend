FROM alpine:latest
ARG port
USER root
RUN apk add curl sudo
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
RUN chmod +x /usr/local/bin/docker-compose

COPY . /staak-api
WORKDIR /staak-api

ENV PORT=$port

RUN docker-compose build

EXPOSE $PORT

CMD docker-compose up -d