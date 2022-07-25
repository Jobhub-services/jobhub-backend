import { Schema, Document, Types } from 'mongoose';
import { softDeleteModel } from '@/helpers';
import { ApplicationStatus, IApplication, InterviewStatus } from '@/interfaces/application.interface';
import User from '@/models/User';
import Company from '@/models/Company';
import CompanyJob from '@/models/CompanyJob';
import Developer from '@/models/Developer';
import messagingService from '@/services/MessagingService';

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

async function populateFiles(docs, next) {
	try {
		if (Array.isArray(docs) && docs.length > 0) {
			const fileIds = [];
			docs.forEach((doc) => {
				if (doc.company && doc.company.avatar && fileIds.indexOf(doc.company.avatar) === -1) fileIds.push(doc.company.avatar);
				if (doc.avatar && fileIds.indexOf(doc.avatar) === -1) fileIds.push(doc.avatar);
				if (Array.isArray(doc.applications))
					doc.applications.forEach((application) => {
						if (fileIds.indexOf(application.avatar) === -1) fileIds.push(application.avatar);
					});
			});
			let fileUrls = {};
			if (fileIds.length > 0) fileUrls = await messagingService.presigneUserMedia(fileIds);
			docs.forEach((doc) => {
				if (doc.company && doc.company.avatar && fileUrls[doc.company.avatar]) doc.company.avatar = fileUrls[doc.company.avatar];
				if (doc.avatar && fileUrls[doc.avatar]) doc.avatar = fileUrls[doc.avatar];
				if (Array.isArray(doc.applications))
					doc.applications.forEach((application) => {
						if (fileUrls[application.avatar]) application.avatar = fileUrls[application.avatar];
					});
			});
		}
	} finally {
		next();
	}
}

applicationSchema.post('aggregate', populateFiles);
applicationSchema.post('find', populateFiles);

const Application = softDeleteModel<IApplication & Document>('Application', applicationSchema);

export default Application;
