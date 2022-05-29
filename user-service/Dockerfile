FROM node:14-alpine as base

EXPOSE 3000
COPY . /src

WORKDIR /src
RUN npm install
RUN npm run build

CMD ["npm", "start"]