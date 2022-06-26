export enum UserType {
	DEVELOPER = 'developer',
	COMPANY = 'company',
	SIMPLE = 'simple',
	ADMIN = 'admin',
}

interface IDeveloperInfo {
	firstName: string;
	lastName: string;
}

interface ICompanyInfo {
	companyName: string;
}

export interface IUser {
	_id: string;
	fullName?: string;
	email: string;
	username: string;
	password: string;
	userType: UserType;
	developerInfo?: IDeveloperInfo;
	companyInfo?: ICompanyInfo;
}
