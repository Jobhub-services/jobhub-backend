import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { IUser, UserType } from '@/interfaces/users.interface';
import User from '@/models/User';

export const auth = (req: Request, res: Response, next: NextFunction) => {
	try {
		let authHeader: any = req.headers['authorization'];

		authHeader = authHeader?.split(' ');
		if (!authHeader || authHeader[0] !== 'Bearer')
			return res.status(401).send({
				message: 'unauthorized',
			});
		jwt.verify(authHeader[1], process.env.JWT_SECRET, async (err: any, user: any) => {
			if (err)
				return res.status(401).send({
					message: 'unauthorized',
				});
			if (!user)
				return res.status(401).send({
					message: 'unauthorized',
				});
			user = await User.findById(user.sub);
			if (!user)
				return res.status(401).send({
					message: 'unauthorized',
				});
			req.rootObjectId = user.id;
			req.user = user;
			next();
		});
	} catch (e) {
		res.status(403).send('HTTP 403 Forbidden');
	}
};

export const authRole = (role: UserType) => (req: Request, res: Response, next: NextFunction) => {
	try {
		const userData: IUser = req.user;
		if (userData.userType === role) return next();
		res.status(401).send({ message: 'unauthorized role' });
	} catch (e) {
		res.status(403).send('HTTP 403 Forbidden');
	}
};
