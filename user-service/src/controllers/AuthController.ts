import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from '@/dtos/auth.dto';
import { IUser, UserType } from '@/interfaces/users.interface';
import { tokenService } from '@/services/HashService';
import User from '@/models/User';
import Company from '@/models/Company';
import Developer from '@/models/Developer';

class AuthController {
	public login = async (req: Request, res: Response) => {
		try {
			const userInfo: LoginDto = req.body;
			const expiration = Number(process.env.TOKEN_EXPIRATION);
			const user: IUser = await User.findOne({ $or: [{ email: userInfo.username }, { username: userInfo.username }] });
			if (user) {
				const checkPassword = await tokenService.check(userInfo.password, user.password);
				if (checkPassword) {
					const token = tokenService.createToken(user, expiration);
					if (token) {
						res.status(200).send({ message: 'user authentified successfully', data: token });
						return;
					}
				}
			}
			res.status(404).send({ message: 'Username/Email or password are invalid' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	public register = async (req: Request, res: Response) => {
		try {
			const userInfo: RegisterDto = req.body;
			const existingUser: IUser = await User.findOne({ $or: [{ email: userInfo.email }, { username: userInfo.username }] });
			if (existingUser) return res.status(403).send({ message: 'Email or Username already exist' });
			userInfo.password = await tokenService.hash(userInfo.password);
			const userToCreate = { ...userInfo };
			delete userToCreate.companyInfo;
			delete userToCreate.developerInfo;
			const user = await User.create(userToCreate);
			if (user.userType === UserType.COMPANY) await Company.create({ userId: user._id, companyName: userInfo.companyInfo.companyName });
			else if (user.userType === UserType.DEVELOPER)
				await Developer.create({ userId: user._id, firstName: userInfo.developerInfo.firstName, lastName: userInfo.developerInfo.lastName });
			res.status(200).send({ message: 'User registred successfully', data: user });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

export default AuthController;
