import { Types } from 'mongoose';

export enum UserType {
	DEVELOPER = 'developer',
	COMPANY = 'company',
	SIMPLE = 'simple',
	ADMIN = 'admin',
}

export interface IPasswordToken {
	userId: Types.ObjectId;
	passCode: string;
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
