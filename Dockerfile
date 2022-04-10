FROM node:14.15.4-alpine

COPY . /staak-api
WORKDIR /staak-api
RUN npm install pm2 -g
RUN npm install

#build users service 

WORKDIR /staak-api/user-service
RUN npm install
RUN npm run build

#build jobs service 

WORKDIR /staak-api/jobs-service
RUN npm install
RUN npm run build

#build gateway 

WORKDIR /staak-api/staak-gateway
ENV LOG_LEVEL=debug
RUN npm install

WORKDIR /staak-api
ENV NODE_ENV=production
EXPOSE $PORT

CMD export NODE_ENV=production && pm2 --name user_service start user-service/dist/index.js && pm2 --name jobs_service start jobs-service/dist/index.js && npm run start:app