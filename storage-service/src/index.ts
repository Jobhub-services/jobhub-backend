import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
const NODE_ENV = process.env.NODE_ENV || 'development';
dotenvConfig({ path: `.env.${NODE_ENV}` });

import express, { json } from 'express';
import { connect, set } from 'mongoose';
import cors from 'cors';
import Router from '@/routes';
import { dbConnection } from '@/config/db.config';
import MessagingService from '@/services/MessagingService';

new MessagingService();

const app = express();
app.use(json());
app.use(cors());
app.use(`/`, Router);

if (NODE_ENV !== 'production') set('debug', true);

connect(dbConnection.url, dbConnection.options)
	.then(async (_connection) => {
		app.listen(process.env.APP_PORT, () => {
			console.log(`server started. ${process.env.APP_PORT}`);
		});
	})
	.catch((error) => console.log(error));
