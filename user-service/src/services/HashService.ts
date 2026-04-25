import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '@/interfaces/users.interface';

export default class TokenService {
	jwtSecret: string = process.env.JWT_SECRET;

	hash = async (value: string) => {
		try {
			return await bcrypt.hash(value, 10);
		} catch (e) {
			return null;
		}
	};
	check = async (data: string, encrypted: string) => {
		try {
			return await bcrypt.compare(data, encrypted);
		} catch (e) {
			return null;
		}
	};

	createToken = (user: IUser, expiresIn = 60 * 60 * 24 * 3) => {
		try {
			const jwtSecret = this.jwtSecret;
			const token = jwt.sign(
				{
					sub: String(user._id),
					_id: String(user._id),
					userType: user.userType,
					username: user.username,
					email: user.email,
				},
				jwtSecret,
				{ expiresIn },
			);
			return token;
		} catch (e) {
			return null;
		}
	};
	hashToken = (payload: any, expiresIn: number) => {
		try {
			const jwtSecret = this.jwtSecret;
			const token = jwt.sign(payload, jwtSecret, { expiresIn });
			return token;
		} catch (e) {
			return null;
		}
	};
	verifyToken = (token: string) => {
		try {
			const jwtSecret = this.jwtSecret;
			const payload: any = jwt.verify(token, jwtSecret);
			return payload;
		} catch {
			return null;
		}
	};
	stringToBase64 = (text: string) => {
		try {
			const buff = Buffer.from(text);
			const base64data = buff.toString('base64');
			return base64data;
		} catch {
			return null;
		}
	};
	base64ToString = (base64: string) => {
		try {
			let buff = Buffer.from(base64, 'base64');
			let text = buff.toString('ascii');
			return text;
		} catch {
			return null;
		}
	};
}

export const tokenService = new TokenService();
