import { model, Schema, Document } from 'mongoose';
import { AvailabilityStatus, IDeveloper } from '@/interfaces/developer.interface';
import { storageService } from '@/services/StorageService';
import Skill from '@/models/Skill';
import Language from '@/models/Language';
import Country from '@/models/Country';
import User from '@/models/User';
import JobRole from '@/models/JobRole';
import Currency from '@/models/Currency';

const languageSchema = new Schema({
	language: { type: Schema.Types.ObjectId, ref: Language },
	level: String,
});

const roleSchema = new Schema({
	other_roles: [{ type: Schema.Types.ObjectId, ref: JobRole }],
	primary_role: { type: Schema.Types.ObjectId, ref: JobRole },
	experience: String,
});

const experienceSchema = new Schema({
	title: String,
	company_name: String,
	startDate: String,
	endDate: String,
	description: String,
	job_type: String,
	location: { type: Schema.Types.ObjectId, ref: Country },
});

const educationSchema = new Schema({
	title: String,
	school: String,
	startDate: String,
	endDate: String,
});

const certificationSchema = new Schema({
	certificationId: String,
	title: String,
	provider: String,
	description: String,
	issuedDate: String,
	expirationDate: String,
	link: String,
});

const socialSchema = new Schema({
	website: String,
	git: String,
	linkedin: String,
	twitter: String,
});

const addressSchema = new Schema({
	country: { type: Schema.Types.ObjectId, ref: Country },
	city: String,
	street: String,
});

const developerSchema: Schema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: User },
		summary: {
			type: String,
		},
		languages: [languageSchema],
		skills: [{ type: Schema.Types.ObjectId, ref: Skill }],
		role: roleSchema,
		work_experience: [experienceSchema],
		educations: [educationSchema],
		certifications: [certificationSchema],
		social_profile: socialSchema,
		address: addressSchema,
		currency: { type: Schema.Types.ObjectId, ref: Currency },
		desired_location: [{ type: Schema.Types.ObjectId, ref: Country }],
		salary: String,
		job_type: String,
		other_job_type: [{ type: String }],
		wants: String,
		status: {
			type: String,
			enum: AvailabilityStatus,
		},
		avatar: {
			type: String,
		},
		resume: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

developerSchema.methods.toJSON = function () {
	const developer: IDeveloper = this.toObject();
	if (developer.resume) developer.resume = storageService.createFileURL(developer.resume);
	if (developer.avatar) developer.avatar = storageService.createFileURL(developer.avatar);
	return developer;
};

const Developer = model<IDeveloper & Document>('Developer', developerSchema);

export default Developer;
