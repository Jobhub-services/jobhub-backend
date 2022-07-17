import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
const NODE_ENV = process.env.NODE_ENV || 'development';
dotenvConfig({ path: `.env.${NODE_ENV}` });

import { connect, set, Types, Schema } from 'mongoose';
import express, { json, Request, Response } from 'express';
import cors from 'cors';
import '@/types';
import { dbConnection } from '@/config/db.config';
import { SERVICE_API_PATH } from '@/constants/app.constants';
import Router from '@/routes';

const app = express();
app.use(json());
app.use(cors());
app.use('/', (req: Request, res: Response, next) => {
	if (req.headers['user_id'] && req.headers['user']) {
		req.user = JSON.parse(req.headers['user'] as string);
		const userId = new Types.ObjectId(String(req.headers['user_id']));
		req.user._id = userId;
		req.rootObjectId = userId;
	}
	next();
});
app.use(`/api/${SERVICE_API_PATH}`, Router);

if (NODE_ENV !== 'production') set('debug', true);

connect(dbConnection.url, dbConnection.options)
	.then(async (_connection) => {
		app.listen(process.env.APP_PORT, () => {
			console.log(`server started. ${process.env.APP_PORT}`);
		});
	})
	.catch((error) => console.log(error));
