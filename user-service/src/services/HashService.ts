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
			const token = jwt.sign({ sub: user._id }, jwtSecret, { expiresIn });
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
}

export const tokenService = new TokenService();
