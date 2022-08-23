import { Types } from 'mongoose';

export enum UserType {
	DEVELOPER = 'developer',
	COMPANY = 'company',
}

export interface IUser {
	_id: Types.ObjectId;
	fullName?: string;
	email: string;
	username: string;
	password: string;
	userType: UserType;
}
