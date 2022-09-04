import { Request, Response } from 'express';
import User from '@/models/User';
import { RegisterDto } from '@/dtos/auth.dto';
import { IUser, UserType } from '@/interfaces/users.interface';
import { tokenService } from '@/services/HashService';

class AdminController {
	public createAdmin = async (req: Request, res: Response) => {
		try {
			const userInfo: RegisterDto = req.body;
			const existingUser: IUser = await User.findOne({ $or: [{ email: userInfo.email }, { username: userInfo.username }] });
			if (existingUser) return res.status(403).send({ message: 'Email or Username already exist' });
			userInfo.password = await tokenService.hash(userInfo.password);
			userInfo.userType = UserType.ADMIN;
			await User.create(userInfo);
			res.status(200).send({ message: 'Admin created' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

export default AdminController;
