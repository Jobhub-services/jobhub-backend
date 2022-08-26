import { IUser } from '@/interfaces/users.interface';
import { Types } from 'mongoose';
import express from 'express';
express;

declare module 'express' {
	interface Request {
		user?: IUser;
		rootObjectId?: Types.ObjectId;
	}
}
