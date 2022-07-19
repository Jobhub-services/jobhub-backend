import { Schema, Types } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { softDeleteModel } from '@/helpers';
import { ICompanyJob, JobTypes, JobDuration, SalaryType, JobStatus } from '@/interfaces/companyJob.interface';
import User from '@/models/User';
import { countrySchema, currencySchema, jobCategorySchema, skillSchema } from '@/models/MetadataSchema';
import Company from '@/models/Company';

const jobLocationSchema = new Schema({
	country: countrySchema,
	city: { type: String, trim: true },
});

const companyDivisionSchema: Schema = new Schema(
	{
		_id: Types.ObjectId,
		name: String,
	},
	{
		_id: false,
	}
);

const questionSchema = new Schema({
	question: String,
});

const companyJobSchema: Schema = new Schema(
	{
		title: String,
		description: String,
		start_salary: String,
		end_salary: String,
		benefits: String,
		work_remotly: Boolean,
		hire_remotly: Boolean,
		visa_sponsorship: Boolean,
		responsabilities: String,
		requirements: String,
		job_type: {
			type: String,
			enum: JobTypes,
		},
		duration: {
			type: String,
			enum: JobDuration,
		},
		duration_range: [{ type: String }],
		salary_type: {
			type: String,
			enum: SalaryType,
		},
		company_division: companyDivisionSchema,
		category: jobCategorySchema,
		currency: currencySchema,
		work_location: jobLocationSchema,
		hire_location: [jobLocationSchema],
		skills: [skillSchema],
		questions: [questionSchema],
		education: [{ type: String }],
		certification: [{ type: String }],
		status: {
			type: String,
			enum: JobStatus,
			default: JobStatus.READY,
		},
		createdBy: {
			type: Types.ObjectId,
			ref: User,
		},
		updatedBy: {
			type: Types.ObjectId,
			ref: User,
		},
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

companyJobSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true, deletedBy: true });

companyJobSchema.virtual('company', { ref: Company, localField: 'createdBy', foreignField: 'userId', justOne: true });

const CompanyJob = softDeleteModel<ICompanyJob>('CompanyJob', companyJobSchema);

export const normalizetoJSON = (object: any, includeQuestion: boolean = false) => {
	const job = object.toJSON();
	return {
		...job,
		category: job.category?.name,
		company_division: job.company_division?.name,
		currency: {
			code: job.currency?.code,
			name: job.currency?.name,
		},
		skills: job.skills?.map((skill) => {
			return skill.name;
		}),

		questions: job.questions?.map((question) => {
			if (includeQuestion) return { _id: question._id, question: question.question };
			return question.question;
		}),
		work_location: {
			country: job.work_location?.country.name,
			city: job.work_location?.city,
		},
		hire_location: job.hire_location?.map((location) => {
			return {
				country: location?.country.name,
				city: location?.city,
			};
		}),
		createdBy: {
			companyName: job?.createdBy?.companyInfo?.companyName,
		},
	};
};

export const normalizetoJSONs = (objects: any[]) => {
	return objects.map((job) => {
		return normalizetoJSON(job);
	});
};

export default CompanyJob;
