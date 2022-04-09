FROM tmaier/docker-compose:latest
ARG port
USER root

ENV PORT=$port
COPY . /staak-api
WORKDIR /staak-api


RUN export APP_PORT=$PORT && docker-compose build

EXPOSE $PORT

CMD docker-compose up -d