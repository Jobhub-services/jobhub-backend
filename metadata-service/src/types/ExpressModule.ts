import { IUser } from '@/interfaces/users.interface';
import express from 'express';
express;

declare module 'express' {
	interface Request {
		user?: IUser;
	}
}
