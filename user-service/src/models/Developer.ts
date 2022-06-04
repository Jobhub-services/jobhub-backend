import { model, Schema, Document } from 'mongoose';
import { IDeveloper } from '@/interfaces/developer.interface';
import { storageService } from '@/services/StorageService';

const languageSchema = new Schema({
	language: { type: Schema.Types.ObjectId, ref: 'Language' },
	level: String,
});

const roleSchema = new Schema({
	other_roles: [{ type: String }],
	primary_role: String,
});

const experienceSchema = new Schema({
	title: String,
	company_name: String,
	startDate: String,
	endDate: String,
	description: String,
	job_type: String,
	location: { type: Schema.Types.ObjectId, ref: 'Country' },
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

const developerSchema: Schema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		summary: {
			type: String,
		},
		languages: [languageSchema],
		skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
		role: roleSchema,
		work_experience: [experienceSchema],
		educations: [educationSchema],
		certifications: [certificationSchema],
		social_profile: socialSchema,
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
	developer.resume = storageService.createFileURL(developer.resume);
	return developer;
};

const Developer = model<IDeveloper & Document>('Developer', developerSchema);

export default Developer;
