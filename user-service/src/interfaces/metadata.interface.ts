import { Types } from 'mongoose';

export interface ICountryData {
	_id: Types.ObjectId;
	code: string;
	name: string;
}

export interface IJobRoleData {
	_id: Types.ObjectId;
	name: string;
}

export interface ILangData {
	_id: Types.ObjectId;
	code: string;
	name: string;
}

export interface ISkillData {
	_id: Types.ObjectId;
	industry: string;
	name: string;
}

export interface ICurrencyData {
	_id: Types.ObjectId;
	code: string;
	name: string;
}

export interface IJobCategoryData {
	_id: Types.ObjectId;
	industry: string;
	name: string;
}
