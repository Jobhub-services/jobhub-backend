import { Types } from 'mongoose';
import { ILangData, IJobRoleData, ICountryData, ISkillData, ICurrencyData } from '@/interfaces/metadata.interface';

export enum AvailabilityStatus {
	READY = 'ready',
	OPEN = 'open',
	CLOSED = 'closed',
}

type Languages = {
	language?: ILangData;
	level?: string;
};

type Roles = {
	other_roles?: IJobRoleData[];
	primary_role?: IJobRoleData;
	experience?: string;
};

type Experiences = {
	title?: string;
	company_name?: string;
	startDate?: string;
	endDate?: string;
	description?: string;
	job_type?: string;
	location?: ICountryData;
};

type Educations = {
	title?: string;
	school?: string;
	startDate?: string;
	endDate?: string;
};

type Certifications = {
	certificationId?: string;
	title?: string;
	provider?: string;
	description?: string;
	issuedDate?: string;
	expirationDate?: string;
	link?: string;
};

type Socials = {
	website?: string;
	git?: string;
	linkedin?: string;
	twitter?: string;
};

type Address = {
	country?: ICountryData;
	city?: string;
	street?: string;
};

export interface IDeveloper {
	userId?: Types.ObjectId;
	user?: any;
	summary?: string;
	languages?: Languages[];
	skills?: ISkillData[];
	role?: Roles;
	firstName: string;
	lastName: string;
	work_experience?: Experiences[];
	educations?: Educations[];
	certifications?: Certifications[];
	social_profile?: Socials;
	address: Address;
	currency: ICurrencyData;
	desired_location: ICountryData[];
	salary?: string;
	job_type?: string;
	other_job_type?: string[];
	wants?: string;
	status?: AvailabilityStatus;
	avatar?: string;
	avatarUrl?: string;
	resume?: string;

	toJSON(): IDeveloper;
}
