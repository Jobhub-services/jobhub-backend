import { Schema } from 'mongoose';
export interface ICompanyDivision {
	company_id: Schema.Types.ObjectId;
	name: string;
}
export interface ICompany {
	userId: Schema.Types.ObjectId;
}
