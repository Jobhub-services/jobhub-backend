import { Types } from 'mongoose';
import { ICountryData, ITimezoneData, ICurrencyData } from '@/interfaces/metadata.interface';

export type TSocialProfile = {
	linkedin?: String;
	facebook?: String;
	website?: String;
	twitter?: String;
};
export type TGeneralInfo = {
	founded?: String;
	industry?: String;
	company_size?: String;
};

export type THeadQuarter = {
	country: ICountryData;
	city?: String;
	street?: String;
};

export interface ICompanyDivision {
	_id?: Types.ObjectId;
	name: string;
}

export interface ICompany {
	userId: Types.ObjectId;
	user: any;
	description?: string;
	companyName: string;
	keywords?: string[];
	company_division?: ICompanyDivision[];
	social_profile?: TSocialProfile;
	headquarter?: THeadQuarter;
	generalinfo?: TGeneralInfo;
	avatar?: string;
	currency?: ICurrencyData;
	timezone?: ITimezoneData;

	toJSON(): ICompany;
}
