#!/bin/bash
npm run start:dev
cd user-service
npm run start:dev

cd ../jobs-service
npm run start:dev

cd ../metadata-service
npm run start:dev