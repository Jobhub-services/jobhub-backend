import { IUser } from '@/interfaces/users.interface';
import { Schema } from 'mongoose';
import express from 'express';
express;

declare module 'express' {
	interface Request {
		user?: IUser;
		rootObjectId?: Schema.Types.ObjectId;
	}
}
