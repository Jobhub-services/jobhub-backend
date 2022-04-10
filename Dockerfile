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
RUN (npm run start --prefix user-service &)
ENV NODE_ENV=production
EXPOSE 3001
EXPOSE 3002
EXPOSE $PORT


CMD (npm run start --prefix user-service &) && (npm run start --prefix jobs_service &) && npm run start:app