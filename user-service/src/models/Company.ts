import { model, Schema, Document } from 'mongoose';
import { ICompany } from '@/interfaces/company.interface';
import Country from '@/models/Country';

const headquarterSchema: Schema = new Schema({
	country: { type: Schema.Types.ObjectId, ref: Country },
	city: String,
	street: String
})
const generalInfoSchema: Schema = new Schema({
	founded: String,
	industry: String,
	company_size: String,
})
const socialSchema: Schema = new Schema({
	linkedin: String,
	facebook: String,
	website: String,
	twitter: String,
})
const companySchema: Schema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		description: { type: String },
		social_profile: socialSchema,
		keywords: { type: [String] },
		company_division: [{
			localField: '_id',
			foreignField: 'company_id',
			ref: 'ComapnyDivision'
		}],
		headquarter: headquarterSchema,
		generalinfo: generalInfoSchema
	},
	{
		timestamps: true,
	}
);

const Company = model<ICompany & Document>('Company', companySchema);

export default Company;
