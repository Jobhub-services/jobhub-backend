import { Request, Response } from 'express';
import { IUser, UserType } from '@/interfaces/users.interface';
import Developer from '@/models/Developer';
import Company from '@/models/Company';
import { tokenService } from '@/services/HashService';
import User from '@/models/User';
import { permissionService } from '@/services/PermissionService';

export default class UserController {
	public userInfo = async (req: Request, res: Response) => {
		try {
			const userId = req.rootObjectId;
			const user: IUser = await User.findById(userId).lean();
			if (!user) return res.status(404).send({ message: 'User not found' });
			delete user.password;
			const userInfo: any = { ...user };
			if (user.userType === UserType.DEVELOPER) {
				const developer = await Developer.findOne({ userId: user._id });
				userInfo.firstName = developer?.firstName;
				userInfo.lastName = developer?.lastName;
				userInfo.avatar = developer?.avatar;
			} else if (user.userType === UserType.COMPANY) {
				const company = await Company.findOne({ userId: user._id });
				userInfo.companyName = company?.companyName;
				userInfo.owner_first_name = company?.owner_first_name;
				userInfo.owner_last_name = company?.owner_last_name;
				userInfo.avatar = company?.avatar;
				userInfo.enableCreateJob = await permissionService.checkJobCreationStatus(user._id);
			}
			res.status(200).send({ message: 'Info fetched successfully', data: userInfo });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	updateSecuritySettings = async (req: Request, res: Response) => {
		try {
			const profileBody: any = req.body;
			const rootObjectId = req.rootObjectId;
			if (profileBody.newPassword !== profileBody.confirmPassword) res.status(404).send({ message: 'Please confirm your password' });
			const user = await User.findOne({ _id: rootObjectId });
			if (user) {
				const checkPassword = await tokenService.check(profileBody.currentPassword, user.password);
				if (checkPassword) {
					user.password = await tokenService.hash(profileBody.newPassword);
					await user.save();
					res.status(200).send({ message: 'Password changed successfully' });
					return;
				}
				res.status(404).send({ message: 'Invalid current password' });
			}
			res.status(404).send({ message: 'Invalid user' });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}
