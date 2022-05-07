import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { IUser } from '@/interfaces/users.interface';

export default class TokenService {
	public static async hash(value: string) {
		try {
			return await bcrypt.hash(value, 10);
		} catch (e) {
			console.log(e);
			return null;
		}
	}
	public static async check(data: string, encrypted: string) {
		try {
			return await bcrypt.compare(data, encrypted);
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	public static createToken(user: IUser) {
		try {
			const jwtSecret = process.env.JWT_SECRET;
			const expiresIn = 60 * 60 * 24 * 3;
			const token = jwt.sign({ sub: user._id }, jwtSecret, { expiresIn });
			return token;
		} catch (e) {
			console.log(e);
			return null;
		}
	}
}
