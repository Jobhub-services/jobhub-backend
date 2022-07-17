import { model, Schema, Types, Document } from 'mongoose';
import { ICompany } from '@/interfaces/company.interface';
import User from '@/models/User';
import { countrySchema } from '@/models/MetadataSchema';

const headquarterSchema: Schema = new Schema({
	country: countrySchema,
	city: String,
	street: String,
});
const generalInfoSchema: Schema = new Schema({
	founded: String,
	industry: String,
	company_size: String,
});
const socialSchema: Schema = new Schema({
	linkedin: String,
	facebook: String,
	website: String,
	twitter: String,
});

const companyDivisionSchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
});

const companySchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		description: String,
		companyName: String,
		social_profile: socialSchema,
		keywords: [{ type: String }],
		headquarter: headquarterSchema,
		generalinfo: generalInfoSchema,
		company_division: [companyDivisionSchema],
		avatar: String,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

companySchema.virtual('user', { ref: User, localField: 'userId', foreignField: '_id', justOne: true });

const Company = model<ICompany & Document>('Company', companySchema);

export default Company;
