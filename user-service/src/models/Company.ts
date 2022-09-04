import { model, Schema, Types, Document } from 'mongoose';
import { ICompany } from '@/interfaces/company.interface';
import User from '@/models/User';
import { countrySchema, currencySchema, timezoneSchema } from '@/models/MetadataSchema';
import CompanyJob from '@/models/CompanyJob';
import messagingService from '@/services/MessagingService';

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
		owner_first_name: String,
		owner_last_name: String,
		social_profile: socialSchema,
		keywords: [{ type: String }],
		headquarter: headquarterSchema,
		generalinfo: generalInfoSchema,
		company_division: [companyDivisionSchema],
		avatar: String,
		currency: currencySchema,
		timezone: timezoneSchema,
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

async function populateFiles(doc, next) {
	try {
		if (Array.isArray(doc) && doc.length > 0) {
			const fileIds = doc.map((doc) => doc.avatar);
			const fileUrls = await messagingService.presigneUserMedia(fileIds);
			doc.forEach((company) => {
				company.avatar = fileUrls[company.avatar];
			});
		} else if (doc) {
			doc.avatar = await messagingService.presigneUserMedia(doc.avatar);
		}
	} finally {
		next();
	}
}

companySchema.virtual('user', { ref: User, localField: 'userId', foreignField: '_id', justOne: true });
companySchema.virtual('jobs', { ref: CompanyJob, localField: 'userId', foreignField: 'createdBy' });
companySchema.virtual('number_job', { ref: CompanyJob, localField: 'userId', foreignField: 'createdBy', count: true });

companySchema.post('findOne', populateFiles);
companySchema.post('find', populateFiles);

companySchema.methods.toJSON = function () {
	const company = this.toObject();
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
