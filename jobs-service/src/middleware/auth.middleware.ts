import { NextFunction, Request, Response } from 'express';
import { IUser, UserType } from '@/interfaces/users.interface';

export const authRole = (role: UserType) => (req: Request, res: Response, next: NextFunction) => {
	try {
		const userData: IUser = req.user;
		if (userData.userType === role) return next();
		res.status(401).send({ message: 'unauthorized role' });
	} catch (e) {
		res.status(403).send('HTTP 403 Forbidden');
	}
};
