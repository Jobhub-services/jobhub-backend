import { NextFunction, Request, Response } from 'express';
import { tokenService } from '@/services/HashService';

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
