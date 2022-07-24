import { model, Schema, Types, Document } from 'mongoose';
import { ICompany } from '@/interfaces/company.interface';
import User from '@/models/User';
import { countrySchema } from '@/models/MetadataSchema';
import CompanyJob from '@/models/CompanyJob';
import { storageService } from '@/services/StorageService';

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
companySchema.virtual('jobs', { ref: CompanyJob, localField: 'userId', foreignField: 'createdBy' });
companySchema.virtual('number_job', { ref: CompanyJob, localField: 'userId', foreignField: 'createdBy', count: true });

companySchema.virtual('avatarUrl').get(function () {
	const avatar = this.avatar;
	if (avatar) return storageService.createFileURL(avatar);
	return null;
});

companySchema.methods.toJSON = function () {
	const company = this.toObject();
	company.avatar = company.avatarUrl;
	delete company.avatarUrl;
	company.company_division = company?.company_division?.map((division) => division.name);
	if (company.user) {
		const jsonData = company.user;
		company.user = { email: jsonData.email, username: jsonData.username };
	}
	return company;
};

export const populateCompaniesToJSON = (companies: ICompany[]) => {
	const result = [];
	companies.forEach((company) => {
		result.push(companyToJSON(company));
	});
	return result;
};

export const companyToJSON = (company: ICompany) => {
	const result: any = {
		...company.toJSON(),
	};
	result.headquarter = {
		...result.headquarter,
		country: result?.headquarter?.country.name,
	};
	return result;
};

const Company = model<ICompany & Document>('Company', companySchema);

export default Company;
