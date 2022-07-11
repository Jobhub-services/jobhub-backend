import { model, Schema, Document } from 'mongoose';
import { ICompany } from '@/interfaces/company.interface';
import Country from '@/models/Country';
import { storageService } from '@/services/StorageService';
import User from '@/models/User';

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
		company_division: { type: [String] },
		headquarter: headquarterSchema,
		generalinfo: generalInfoSchema,
		avatar: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

companySchema.virtual('user', { ref: User, localField: 'userId', foreignField: '_id', justOne: true });

const autoPopulate = function (next) {
	this.populate('user');
	next();
};

companySchema.pre('findOne', autoPopulate);
companySchema.pre('find', autoPopulate);

companySchema.methods.toJSON = function () {
	const company: ICompany = this.toObject();
	if (company.avatar) company.avatar = storageService.createFileURL(company.avatar);
	return company;
};

const Company = model<ICompany & Document>('Company', companySchema);

export default Company;
