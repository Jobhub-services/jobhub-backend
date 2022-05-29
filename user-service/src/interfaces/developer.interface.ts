import { Schema } from 'mongoose';

type Languages = {
	language: Schema.Types.ObjectId;
	level: string;
};

type Roles = {
	other_roles: string[];
	primary_role: string;
};

type Experiences = {
	title: string;
	company_name: string;
	startDate: string;
	endDate: string;
	description: string;
	job_type: string;
	location: Schema.Types.ObjectId;
};

type Educations = {
	title: string;
	school: string;
	startDate: string;
	endDate: string;
};

type Certifications = {
	certificationId: string;
	title: string;
	provider: string;
	description: string;
	issuedDate: string;
	expirationDate: string;
	link: string;
};

type Socials = {
	website: string;
	git: string;
	linkedin: string;
	twitter: string;
};

export interface IDeveloper {
	userId: Schema.Types.ObjectId;
	summary: string;
	languages: Languages[];
	skills: Schema.Types.ObjectId[];
	role: Roles;
	work_experience: Experiences[];
	educations: Educations[];
	certifications: Certifications[];
	social_profile: Socials;
	resume: string;
}
