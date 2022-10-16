import { model, Schema, Types, Document } from 'mongoose';
import { ICompany } from '@/interfaces/company.interface';
import User from '@/models/User';
import { countrySchema } from '@/models/MetadataSchema';
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
companySchema.post('findOne', populateFiles);
companySchema.post('find', populateFiles);

companySchema.virtual('user', { ref: User, localField: 'userId', foreignField: '_id', justOne: true });

const Company = model<ICompany & Document>('Company', companySchema);

export default Company;
