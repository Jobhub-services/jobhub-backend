#!/bin/bash

# install modules for main app
npm install

# install modules for user-service
cd user-service
npm install

# install modules for job-service
cd ../jobs-service
npm install

# install modules for metadata-service
cd ../metadata-service
npm install

# install modules for notification-service
cd ../notification-service
npm install

# install modules for payment-service
cd ../payment-service
npm install

# install modules for staak-gateway
cd ../staak-gateway
npm install

# install modules for storage-service
cd ../storage-service
npm install

# install modules for user-service
cd ../user-service
npm install

# install modules for websocket-manager
cd ../websocket-manager
npm install