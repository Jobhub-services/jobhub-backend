import { Types } from 'mongoose';

export enum UserType {
	DEVELOPER = 'developer',
	COMPANY = 'company',
	ADMIN = 'admin',
}

export interface IUser {
	_id: Types.ObjectId;
	fullName?: string;
	email: string;
	phone: { country_code: string; number: string };
	username: string;
	password: string;
	userType: UserType;
}
