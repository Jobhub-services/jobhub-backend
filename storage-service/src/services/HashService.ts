import jwt from 'jsonwebtoken';

export default class TokenService {
	jwtSecret: string = process.env.JWT_SECRET;

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
