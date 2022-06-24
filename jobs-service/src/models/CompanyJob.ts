import { Schema } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { softDeleteModel } from '@/helpers';
import { ICompanyJob, JobTypes, JobDuration, SalaryType, JobStatus } from '@/interfaces/companyJob.interface';

const jobLocationSchema = new Schema({
	country: { type: Schema.Types.ObjectId, ref: 'Country' },
	city: { type: String, trim: true },
});

const companyJobSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		responsabilities: {
			type: String,
		},
		company_division: { type: Schema.Types.ObjectId, ref: 'CompanyDivision' },
		category: { type: Schema.Types.ObjectId, ref: 'JobCategory' },
		job_type: {
			type: String,
			enum: JobTypes,
		},
		duration: {
			type: String,
			enum: JobDuration,
		},
		duration_range: [
			{
				type: String,
			},
		],
		salary_type: {
			type: String,
			enum: SalaryType,
		},
		start_salary: {
			type: String,
		},
		end_salary: {
			type: String,
		},
		currency: { type: Schema.Types.ObjectId, ref: 'Currency' },
		benefits: {
			type: String,
		},
		work_remotly: {
			type: Boolean,
		},
		hire_remotly: {
			type: Boolean,
		},
		visa_sponsorship: {
			type: Boolean,
		},
		work_location: jobLocationSchema,
		hire_location: [jobLocationSchema],
		education: [
			{
				type: String,
			},
		],
		certification: [
			{
				type: String,
			},
		],
		skills: [{ type: Schema.Types.ObjectId, ref: 'Skill' }],
		requirements: {
			type: String,
		},
		status: {
			type: String,
			enum: JobStatus,
			default: JobStatus.READY,
		},
		createdBy: {
			type: Schema.Types.ObjectId, ref: 'User'
		},
		updatedBy: {
			type: Schema.Types.ObjectId, ref: 'User'
		},

		applications: [{
			application: { type: Schema.Types.ObjectId, ref: 'Application' },
			user: { type: Schema.Types.ObjectId, ref: 'User' },
		}]
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

companyJobSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true, deletedBy: true });

companyJobSchema.virtual('questions', {
	ref: 'JobQuestion',
	localField: '_id',
	foreignField: 'job_id',
});

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
			if (includeQuestion) return { _id: question._id, question: question.question }
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
			companyName: job?.createdBy?.companyInfo?.companyName
		}
	};
};

export const normalizetoJSONs = (objects: any[]) => {
	return objects.map((job) => {
		return normalizetoJSON(job);
	});
};

export default CompanyJob;
