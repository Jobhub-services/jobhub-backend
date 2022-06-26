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

export default Application;
