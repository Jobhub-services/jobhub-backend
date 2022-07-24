import { Schema, Document, Types } from 'mongoose';
import { softDeleteModel } from '@/helpers';
import { ApplicationStatus, IApplication, InterviewStatus } from '@/interfaces/application.interface';
import User from '@/models/User';
import Company from '@/models/Company';
import CompanyJob from '@/models/CompanyJob';
import Developer from '@/models/Developer';

const questionSchema: Schema = new Schema(
	{
		_id: Types.ObjectId,
		question: String,
	},
	{
		_id: false,
	}
);

const responseSchema: Schema = new Schema({
	question: questionSchema,
	response: { type: String },
});

const interviewSchema: Schema = new Schema({
	title: String,
	startDate: String,
	endDate: String,
	note: String,
	link: String,
	location: String,
	status: {
		type: String,
		default: InterviewStatus.PENDING,
		enum: InterviewStatus,
	},
});

const applicationSchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		companyId: { type: Types.ObjectId, ref: User },
		jobId: { type: Types.ObjectId, ref: CompanyJob },
		motivation: String,
		notice_period: String,
		start_date: String,
		status: {
			type: String,
			default: ApplicationStatus.NEW,
			enum: ApplicationStatus,
		},
		responses: [responseSchema],
		interviews: [interviewSchema],
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);
applicationSchema.virtual('developer', { ref: Developer, localField: 'userId', foreignField: 'userId', justOne: true });
applicationSchema.virtual('company', { ref: Company, localField: 'companyId', foreignField: 'userId', justOne: true });

const Application = softDeleteModel<IApplication & Document>('Application', applicationSchema);

export const normalizetoJSON = (object: any, includeQuestion: boolean = false) => {
	const app = object.toJSON();
	return {
		...app,
		jobId: {
			_id: app.jobId?._id,
			title: app.jobId?.title,
		},
		company: {
			_id: app.company?._id,
			companyName: app.company?.companyName,
			avatar: app.company?.avatar,
		},
	};
};

export const normalizetoJSONs = (objects: any[]) => {
	return objects.map((job) => {
		return normalizetoJSON(job);
	});
};

export const normalizeTalentDetailtoJSON = (application: any) => {
	const app = application.toJSON();
	let result = {
		...app,
		responses: app?.responses?.map((elem) => {
			return {
				question: elem?.question.question,
				response: elem?.response,
			};
		}),
		jobId: {
			...app?.jobId,
			category: app?.jobId?.category.name,
			currency: app?.jobId?.currency.code,
			skills: app?.jobId?.skills.map((elem) => elem.name),
			work_location: {
				country: app?.jobId?.work_location?.country.name,
				city: app?.jobId?.work_location?.city,
			},
			hire_location: app?.jobId?.hire_location?.map((elem) => {
				return {
					country: elem.country.name,
					city: elem.city,
				};
			}),
		},
	};
	delete result?.jobId?.applications;
	return result;
};
export default Application;
