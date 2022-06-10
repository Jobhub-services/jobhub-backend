import { Schema } from 'mongoose';

export enum AvailabilityStatus {
	READY = 'ready',
	OPEN = 'open',
	CLOSED = 'closed',
}

type Languages = {
	language?: Schema.Types.ObjectId;
	level?: string;
};

type Roles = {
	other_roles?: Schema.Types.ObjectId[];
	primary_role?: Schema.Types.ObjectId;
	experience?: string;
};

type Experiences = {
	title?: string;
	company_name?: string;
	startDate?: string;
	endDate?: string;
	description?: string;
	job_type?: string;
	location?: Schema.Types.ObjectId;
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
	country?: Schema.Types.ObjectId;
	city?: string;
	street?: string;
};

export interface IDeveloper {
	userId?: Schema.Types.ObjectId;
	summary?: string;
	languages?: Languages[];
	skills?: Schema.Types.ObjectId[];
	role?: Roles;
	work_experience?: Experiences[];
	educations?: Educations[];
	certifications?: Certifications[];
	social_profile?: Socials;
	address: Address;
	currency: Schema.Types.ObjectId;
	desired_location: Schema.Types.ObjectId[];
	salary?: string;
	job_type?: string;
	other_job_type?: string[];
	wants?: string;
	status?: AvailabilityStatus;
	avatar?: string;
	resume?: string;
}
