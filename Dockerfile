FROM node:14.15.4-alpine

# for heroku deployment

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

#build metadata service 

WORKDIR /staak-api/metadata-service
RUN npm install
RUN npm run build

#build gateway 

WORKDIR /staak-api/staak-gateway
ENV LOG_LEVEL=debug
RUN npm install


WORKDIR /staak-api
ENV NODE_ENV=production
EXPOSE 3001
EXPOSE 3002
EXPOSE 3003
EXPOSE $PORT


CMD (npm run start --prefix user-service &) && (npm run start --prefix jobs-service &) && (npm run start --prefix metadata-service &) && npm run start:app