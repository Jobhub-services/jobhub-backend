import { Request, Response } from 'express';
import { IUser, UserType } from '@/interfaces/users.interface';
import Developer from '@/models/Developer';
import Company from '@/models/Company';

export default class UserController {
	public userInfo = async (req: Request, res: Response) => {
		try {
			const userData: IUser = req.user;
			delete userData.password;
			const userInfo: any = {
				...userData,
			};
			if (userData.userType === UserType.DEVELOPER) {
				const developer = await Developer.findOne({ userId: userData._id });
				userInfo.firstName = developer.firstName;
				userInfo.lastName = developer.lastName;
				userInfo.avatar = developer.avatarUrl;
			} else if (userData.userType === UserType.COMPANY) {
				const company = await Company.findOne({ userId: userData._id });
				userInfo.companyName = company.companyName;
				userInfo.avatar = company.avatarUrl;
			}
			res.status(200).send({ message: 'Info fetched successfully', data: userInfo });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}
