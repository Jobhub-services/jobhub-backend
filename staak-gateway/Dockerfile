FROM node:14-alpine as base

WORKDIR /src
COPY . /src
RUN npm install

EXPOSE 7000

CMD ["npm", "start"]