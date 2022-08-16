import { Types } from 'mongoose';
import express from 'express';
express;
declare module 'express' {
	interface Request {
		user?: any;
		rootObjectId?: Types.ObjectId;
	}
}
