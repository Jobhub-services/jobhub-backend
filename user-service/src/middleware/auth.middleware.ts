import { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { IUser, UserType } from '@/interfaces/users.interface';
import User from '@/models/User';
import { tokenService } from '@/services/HashService';

export const auth = (req: Request, res: Response, next: NextFunction) => {
	try {
		let authHeader: any = req.headers['authorization'];
		if (authHeader) {
			authHeader = authHeader?.split(' ');
			if (!authHeader || authHeader[0] !== 'Bearer')
				return res.status(401).send({
					message: 'unauthorized',
				});
			authHeader = authHeader[1];
		} else {
			authHeader = req.cookies.accessToken;
			if (!authHeader)
				return res.status(401).send({
					message: 'unauthorized',
				});
		}

		jwt.verify(authHeader, process.env.JWT_SECRET, async (err: any, user: any) => {
			if (err)
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
			global.authUser = user;
			global.accessToken = authHeader;
			next();
		});
	} catch (e) {
		res.status(403).send('HTTP 403 Forbidden');
	}
};

export const authRole = (req: Request, res: Response, next: NextFunction) => (role: UserType) => {
	try {
		const userData: IUser = req.user;
		if (userData.userType === role) return next();
		res.status(401).send({ message: 'unauthorized role' });
	} catch (e) {
		res.status(403).send('HTTP 403 Forbidden');
	}
};

export const authStorage = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.params.token;
		const payload = tokenService.verifyToken(token);
		if (!payload)
			return res.status(401).send({
				message: 'unauthorized',
			});
		next();
	} catch {
		res.status(403).send('HTTP 403 Forbidden');
	}
};
