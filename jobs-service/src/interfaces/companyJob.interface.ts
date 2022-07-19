import { Types } from 'mongoose';
import { ICountryData, ISkillData, ICurrencyData, IJobCategoryData } from '@/interfaces/metadata.interface';
import { ICompany, ICompanyDivision } from '@/interfaces/company.interface';

export enum JobTypes {
	FULL_TIME = 'Full time',
	PART_TIME = 'Part time',
}

export enum SalaryType {
	YEARLY = 'Yearly',
	MONTHLY = 'Monthly',
	HOURLY = 'Hourly',
}

export enum JobDuration {
	PERMANENT = 'Permanent',
	TEMPORARY = 'Temporary',
	SEASONAL = 'Seasonal',
}

export enum JobStatus {
	OPEN = 'open',
	CLOSED = 'closed',
	READY = 'ready',
}

export interface IJobQuestion {
	_id?: Types.ObjectId;
	question: string;
}

export type JobLocation = {
	country: ICountryData;
	city: string;
};

export interface ICompanyJob {
	_id?: Types.ObjectId;
	title: string;
	description: string;
	responsabilities?: string;
	duration_range?: string[];
	start_salary?: string;
	end_salary?: string;
	benefits?: string;
	work_remotly?: boolean;
	hire_remotly?: boolean;
	visa_sponsorship?: boolean;
	education?: string[];
	certification?: string[];
	requirements?: string;
	company_division?: ICompanyDivision;
	category?: IJobCategoryData;
	job_type?: JobTypes;
	duration?: JobDuration;
	salary_type?: SalaryType;
	currency?: ICurrencyData;
	work_location?: JobLocation;
	hire_location?: JobLocation[];
	skills?: ISkillData[];
	status?: JobStatus;
	questions?: IJobQuestion[];
	createdBy?: Types.ObjectId;
	updatedBy?: Types.ObjectId;
	company?: ICompany;
}
