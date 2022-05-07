import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import User from '@/models/User';

export const auth = (req: Request, res: Response, next: NextFunction) => {
	try {
		let authHeader: any = req.headers['authorization'];
		authHeader = authHeader?.split(' ');
		if (!authHeader || authHeader[0] !== 'Bearer')
			res.status(401).send({
				message: 'unauthorized',
			});
		jwt.verify(authHeader[1], process.env.JWT_SECRET, async (err: any, user: any) => {
			if (err || !user)
				return res.status(401).send({
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
	} catch (e) {
		res.status(403).send('HTTP 403 Forbidden');
	}
};

export const authRole = (req: Request, res: Response, next: NextFunction) => {};
