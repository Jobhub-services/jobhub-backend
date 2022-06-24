import { Schema } from 'mongoose';

export enum UserType {
	DEVELOPER = 'developer',
	COMPANY = 'company',
	ADMIN = 'admin',
}

interface IDeveloperInfo {
	firstName: string;
	lastName: string;
	applications: [{
		application: Schema.Types.ObjectId,
		job: Schema.Types.ObjectId
	}]
}

interface ICompanyInfo {
	companyName: string;
}

export interface IUser {
	_id: string;
	email: string;
	username: string;
	password: string;
	userType: UserType;
	developerInfo?: IDeveloperInfo;
	companyInfo?: ICompanyInfo;
}
