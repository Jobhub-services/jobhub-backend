FROM tmaier/docker-compose:latest
ARG port
USER root

ENV PORT=$port
COPY . /staak-api
WORKDIR /staak-api

RUN export PORT=$PORT

RUN docker-compose build

EXPOSE $PORT

CMD docker-compose up -d