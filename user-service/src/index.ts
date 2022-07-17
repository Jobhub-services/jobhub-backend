import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
const NODE_ENV = process.env.NODE_ENV || 'development';
dotenvConfig({ path: `.env.${NODE_ENV}` });

import { connect, set, Types } from 'mongoose';
import express, { json, Request, Response } from 'express';
import fileUpload from 'express-fileupload';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import '@/types';
import { dbConnection } from '@/config/db.config';
import { SERVICE_API_PATH, STORAGE_API_PATH } from '@/constants/app.constants';
import { storageRouter } from '@/routes/storage.routes';
import Router from '@/routes';

const app = express();

app.use(fileUpload({}));
app.use(cookieParser());
app.use(json());
app.use(cors());
app.use('/', (req: Request, res: Response, next) => {
	if (req.headers['user_id'] && req.headers['user']) {
		req.user = JSON.parse(req.headers['user'] as string);
		const userId = new Types.ObjectId(String(req.headers['user_id']));
		req.user._id = userId;
		global.authUser = req.user;
		req.rootObjectId = userId;
	}
	next();
});
app.use(STORAGE_API_PATH, storageRouter);
app.use(`/api/${SERVICE_API_PATH}`, Router);

if (NODE_ENV !== 'production') set('debug', true);

connect(dbConnection.url, dbConnection.options)
	.then(async (_connection) => {
		app.listen(process.env.APP_PORT, () => {
			console.log(`server started. ${process.env.APP_PORT}`);
		});
	})
	.catch((error) => console.log(error));
