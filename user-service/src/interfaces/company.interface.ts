import { Schema } from 'mongoose';
import { TGeneralInfo, THeadQuarter, TSocialProfile } from '@/types/company.type';
export interface ICompanyDivision {
	company_id: Schema.Types.ObjectId;
	name: string;
}
export interface ICompany {
	userId: Schema.Types.ObjectId;
	description?: string;
	keywords?: string[];
	company_division?: string[];
	social_profile?: TSocialProfile;
	headquarter?: THeadQuarter;
	generalinfo?: TGeneralInfo;
}
