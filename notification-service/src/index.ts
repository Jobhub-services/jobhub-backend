import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
const NODE_ENV = process.env.NODE_ENV || 'development';
dotenvConfig({ path: `.env.${NODE_ENV}` });

import { connect, set, Types } from 'mongoose';
import express, { json, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import '@/types';
import { dbConnection } from '@/config/db.config';
import { SERVICE_API_PATH } from '@/constants/app.constants';
import Router from '@/routes';
import MessagingService from '@/services/MessagingService';
import User from '@/models/User';

if (!process.env.VERCEL) new MessagingService();

const app = express();

app.use(json());
app.use(cors({ origin: process.env.FRONTEND_URL || true, credentials: true }));
app.use('/', async (req: Request, _res: Response, next: NextFunction) => {
	if (req.headers['user_id'] && req.headers['user']) {
		try {
			const userId = new Types.ObjectId(String(req.headers['user_id']));
			req.rootObjectId = userId;
			const user = await User.findById(userId).lean();
			if (user) {
				req.user = { ...user, _id: userId } as any;
				global.authUser = req.user!;
			}
		} catch (err) {
			return next(err);
		}
	}
	next();
});
app.use(`/api/${SERVICE_API_PATH}`, Router);

set('strictQuery', true);
if (NODE_ENV !== 'production') set('debug', true);

if (!process.env.VERCEL) {
	connect(dbConnection.url, dbConnection.options)
		.then(async (_connection) => {
			app.listen(process.env.APP_PORT, () => {
				console.log(`server started. ${process.env.APP_PORT}`);
			});
		})
		.catch((error) => console.log(error));
}

export { app };
