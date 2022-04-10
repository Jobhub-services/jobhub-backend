FROM ubuntu:21.04

ARG port
USER root
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get -y install sudo
RUN apt-get install -y python3
RUN apt-get install -y pip
RUN apt-get -y install \
    ca-certificates \
    curl \
    gnupg \
    lsb-release
RUN curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
RUN echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
RUN apt-get -y update
RUN apt-get -y install docker-ce docker-ce-cli containerd.io
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
RUN chmod +x /usr/local/bin/docker-compose

USER docker

RUN service docker start
RUN dockerd
RUN docker info
RUN service docker status


RUN docker-compose --version

COPY . /staak-api
WORKDIR /staak-api

ENV PORT=$port


RUN docker-compose build

EXPOSE $PORT

CMD docker-compose up -d