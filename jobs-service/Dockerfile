FROM node:14-alpine as base

WORKDIR /src
EXPOSE 3000
RUN npm install
COPY . /src

RUN npm run build

CMD ["npm", "start"]