import { Schema } from 'mongoose';

export type SocialProfile = {
	linkedin?: String;
	facebook?: String;
	website?: String;
	twitter?: String;
};
export type GeneralInfo = {
	founded?: String;
	industry?: String;
	company_size?: String;
};

export type HeadQuarter = {
	country: Schema.Types.ObjectId;
	city?: String;
	street?: String;
};

export interface ICompanyDivision {
	company_id: string; // put user id of the company
	name: string;
}
export interface ICompany {
	userId: Schema.Types.ObjectId;
	description?: string;
	keywords?: string[];
	company_division?: string[];
	social_profile?: SocialProfile;
	headquarter?: HeadQuarter;
	generalinfo?: GeneralInfo;
}
