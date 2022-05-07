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

export type JobLocation = {
	country: string;
	city: string;
};

export interface ICompanyJob {
	_id?: string;
	title: string;
	description: string;
	responsabilities?: string;
	company_division?: string;
	category?: string;
	job_type?: JobTypes;
	duration?: JobDuration;
	duration_range?: string[];
	salary_type?: SalaryType;
	start_salary?: string;
	end_salary?: string;
	currency?: string;
	benefits?: string;
	work_remotly?: boolean;
	hire_remotly?: boolean;
	visa_sponsorship?: boolean;
	work_location?: JobLocation;
	hire_location?: JobLocation[];
	education?: string[];
	certification?: string[];
	skills?: string[];
	requirements?: string;
	status?: JobStatus;
	questions?: string[];
	created_by?: string;
	updated_by?: string;
	deleted_by?: string;
}
