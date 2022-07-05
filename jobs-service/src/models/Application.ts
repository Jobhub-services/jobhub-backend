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
export default Application;
