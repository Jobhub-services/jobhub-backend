import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '@/models/User';

export const auth = (req: Request, res: Response, next: NextFunction) => {
	let authHeader: any = req.headers['authorization'];
	authHeader = authHeader?.split(' ');
	if (!authHeader || authHeader[0] !== 'Bearer')
		res.status(401).send({
			message: 'unauthorized',
		});
	jwt.verify(authHeader[1], process.env.JWT_SECRET, async (err: any, user: any) => {
		if (err)
			res.status(401).send({
				message: 'unauthorized',
			});
		user = await User.findById(user.sub);
		if (!user)
			res.status(401).send({
				message: 'unauthorized',
			});
		req.user = user;
		next();
	});
};

export const authRole = (req: Request, res: Response, next: NextFunction) => {};
