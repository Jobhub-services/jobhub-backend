import { model, Schema, Types, Document } from 'mongoose';
import { AvailabilityStatus, IDeveloper } from '@/interfaces/developer.interface';
import { storageService } from '@/services/StorageService';
import { langSchema, jobRoleSchema, countrySchema, skillSchema, currencySchema } from '@/models/MetadataSchema';
import User from '@/models/User';

const languageSchema = new Schema({
	language: langSchema,
	level: String,
});

const roleSchema = new Schema({
	other_roles: [jobRoleSchema],
	primary_role: jobRoleSchema,
	experience: String,
});

const experienceSchema = new Schema({
	title: String,
	company_name: String,
	startDate: String,
	endDate: String,
	description: String,
	job_type: String,
	location: countrySchema,
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
	country: countrySchema,
	city: String,
	street: String,
});

const developerSchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		firstName: String,
		lastName: String,
		summary: String,
		salary: String,
		job_type: String,
		wants: String,
		avatar: String,
		resume: String,
		languages: [languageSchema],
		skills: [skillSchema],
		role: roleSchema,
		work_experience: [experienceSchema],
		educations: [educationSchema],
		certifications: [certificationSchema],
		social_profile: socialSchema,
		address: addressSchema,
		currency: currencySchema,
		desired_location: [countrySchema],
		other_job_type: [{ type: String }],
		status: {
			type: String,
			enum: AvailabilityStatus,
			default: AvailabilityStatus.OPEN,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

developerSchema.virtual('fullName').get(function () {
	const fullName = `${this.firstName ?? ''} ${this.lastName ?? ''}`;
	return fullName.trim();
});

developerSchema.virtual('user', { ref: User, localField: 'userId', foreignField: '_id', justOne: true });

developerSchema.virtual('avatarUrl').get(function () {
	const avatar = this.avatar;
	if (avatar) return storageService.createFileURL(avatar);
	return null;
});

const autoPopulate = function (next) {
	this.populate('user');
	next();
};

developerSchema.pre('findOne', autoPopulate);
developerSchema.pre('find', autoPopulate);

developerSchema.methods.toJSON = function () {
	const developer: IDeveloper = this.toObject();
	if (developer.resume) developer.resume = storageService.createFileURL(developer.resume);
	developer.avatar = developer.avatarUrl;
	delete developer.avatarUrl;
	if (developer.user) {
		const jsonData = developer.user;
		developer.user = { email: jsonData.email, username: jsonData.username };
	}
	return developer;
};

const Developer = model<IDeveloper & Document>('Developer', developerSchema);

export function populateDevelopersToJson(developers: IDeveloper[]) {
	const result = [];
	developers.forEach((developer) => {
		result.push(populateDeveloperToJson(developer));
	});
	return result;
}
export function populateDeveloperToJson(developer: IDeveloper) {
	const result: any = {
		...developer.toJSON(),
	};

	if (Array.isArray(developer.languages))
		result.languages = developer.languages.map((lang) => {
			return {
				level: lang.level,
				language: lang.language.name,
			};
		});
	if (Array.isArray(developer.skills))
		result.skills = developer.skills.map((skill) => {
			return skill.name;
		});
	if (developer.role) {
		result.role.primary_role = developer.role.primary_role?.name;
		if (Array.isArray(developer.role.other_roles)) result.role.other_roles = developer.role.other_roles.map((role) => role.name);
	}
	if (Array.isArray(developer.work_experience)) {
		result.work_experience = developer.work_experience.map((experience) => {
			return {
				title: experience.title,
				company_name: experience.company_name,
				job_type: experience.job_type,
				startDate: experience.startDate,
				endDate: experience.endDate,
				description: experience.description,
				location: experience.location?.name,
			};
		});
	}
	if (developer.address?.country) result.address.country = developer.address.country.name;
	if (developer.currency) result.currency = developer.currency?.name;
	if (Array.isArray(developer.desired_location)) result.desired_location = developer.desired_location.map((location) => location.name);

	return result;
}

export default Developer;
