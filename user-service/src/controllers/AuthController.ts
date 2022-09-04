import { Request, Response } from 'express';
import { LoginDto, RegisterDto } from '@/dtos/auth.dto';
import { IUser, UserType } from '@/interfaces/users.interface';
import { tokenService } from '@/services/HashService';
import User from '@/models/User';
import Company from '@/models/Company';
import Developer from '@/models/Developer';
import { rendomString } from '@/helpers';
import { RESET_PASSWORD_TOKEN_EXPIRATION } from '@/constants/app.constants';
import PasswordToken from '@/models/PasswordToken';
import messagingService from '@/services/MessagingService';
import { metadataService } from '@/services/MetadataService';

class AuthController {
	public login = async (req: Request, res: Response) => {
		try {
			const userInfo: LoginDto = req.body;
			const user: IUser = await User.findOne({ $or: [{ email: userInfo.username }, { username: userInfo.username }] });
			if (user) {
				let expiration = Number(process.env.TOKEN_EXPIRATION);
				if (user.userType === UserType.ADMIN) expiration = expiration * expiration;
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
			if (user.userType === UserType.COMPANY) {
				const currency = await metadataService.getCurrencyByCode('USD');
				await Company.create({ userId: user._id, companyName: userInfo.companyInfo.companyName, currency });
				messagingService.createCompanyCutomer();
			} else if (user.userType === UserType.DEVELOPER)
				await Developer.create({ userId: user._id, firstName: userInfo.developerInfo.firstName, lastName: userInfo.developerInfo.lastName });
			res.status(200).send({ message: 'User registred successfully', data: user });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	public forgetPassword = async (req: Request, res: Response) => {
		try {
			const email = req.body.email;
			const user = await User.findOne({ email });
			if (user) {
				const passCode = rendomString();
				const payload: any = {
					userId: user._id,
					passCode,
				};
				const passToken = await PasswordToken.create(payload);
				payload.tokenId = passToken._id;
				let token = tokenService.hashToken(payload, RESET_PASSWORD_TOKEN_EXPIRATION);
				token = tokenService.stringToBase64(token);
				messagingService.sendPasswordConfirmationEmail({
					token,
					user,
				});
			}
			res.status(200).send({ message: 'Email to reset your password is sent' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	public resetPassword = async (req: Request, res: Response) => {
		try {
			const { email, token, newPassword } = req.body;
			const user = await User.findOne({ email });
			if (!user) return res.status(403).send({ message: 'Something went wrong please try again' });
			const tokenString = tokenService.base64ToString(token);
			const payload = tokenService.verifyToken(tokenString);
			if (!payload) return res.status(403).send({ message: 'Something went wrong please try again' });
			const passToken = await PasswordToken.findById(payload.tokenId);
			if (!passToken) return res.status(403).send({ message: 'Something went wrong please try again' });
			if (passToken.userId.toString() == user._id.toString() && passToken.passCode == payload.passCode) {
				user.password = await tokenService.hash(newPassword);
				await passToken.delete();
				await user.save();
				return res.status(200).send({ message: 'Password reset successfully' });
			}
			res.status(403).send({ message: 'Something went wrong please try again' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

export default AuthController;
