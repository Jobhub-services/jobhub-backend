import express from 'express';
import { Types } from 'mongoose';
import { IUser } from '@/interfaces/users.interface';
express;

declare module 'express' {
	interface Request {
		user?: IUser;
		rootObjectId?: Types.ObjectId;
	}
}
