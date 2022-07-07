import { Schema, Document } from 'mongoose';
import { softDeleteModel } from '@/helpers';
import { ApplicationStatus, IApplication } from '@/interfaces/application.interface';

const responseSchema: Schema = new Schema({
	question: { type: Schema.Types.ObjectId, ref: 'JobQuestions' },
	response: { type: String },
});

const applicationSchema: Schema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		jobId: { type: Schema.Types.ObjectId, ref: 'CompanyJob' },
		motivation: {
			type: String,
		},
		responses: [responseSchema],
		notice_period: {
			type: String,
		},
		start_date: {
			type: String,
		},
		status: {
			type: String,
			default: ApplicationStatus.NEW,
			enum: ApplicationStatus,
		},
	},
	{
		timestamps: true,
	}
);

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
			_id: app.jobId?.createdBy?._id,
			name: app.jobId?.createdBy?.companyInfo?.companyName,
		},
	};
};

export const normalizetoJSONs = (objects: any[]) => {
	return objects.map((job) => {
		return normalizetoJSON(job);
	});
};

export const normalizeTalentDetailtoJSON = (application: any, company: any) => {
	const app = application.toJSON();
	const comp = company.toJSON();
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
		company: {
			...comp,
			companyName: application.jobId?.createdBy?.companyInfo?.companyName,
			headquarter: {
				country: comp.headquarter?.country?.name,
				city: comp?.headquarter?.city,
				street: comp?.headquarter?.street,
			},
		},
	};
	delete result?.jobId?.applications;
	return result;
};
export default Application;
