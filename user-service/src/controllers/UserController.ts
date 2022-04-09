import { IUser } from '@/interfaces/users.interface';
import { Request, Response } from 'express';

export default class UserController {
	public userInfo = async (req: Request, res: Response) => {
		try {
			const userData: IUser = req.user;
			res.status(200).send({ message: 'Info fetched successfully', data: userData });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}
