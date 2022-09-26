import { connection, Types } from 'mongoose';
import JobAlert from '@/models/JobAlert';
import { JOB_ALERTS_NUBER } from '@/constants/app.constants';
import messagingSenderService from '@/services/MessegingSenderService';
import NotificationEmail from '@/models/NotificationEmail';
const JOBS_COLLECTION = 'companyjobs';
const { CLIENT_APP_URL } = process.env;
class JobSuggestionsService {
	private _connection = connection;

	async generateEmailJobs() {
		const lastAlertPage = await JobAlert.findOne();
		const page = lastAlertPage?.pageNumber || 0;
		const limit = JOB_ALERTS_NUBER;
		const collection = this._connection.collection(JOBS_COLLECTION);
		let jobs: any = await collection.aggregate([
			{ $skip: page * limit },
			{ $limit: limit },
			{
				$lookup: {
					from: 'companies',
					localField: 'createdBy',
					foreignField: 'userId',
					as: 'company',
				},
			},
			{ $unwind: '$company' },
			{
				$project: {
					title: 1,
					createdAt: 1,
					work_remotly: 1,
					work_location: 1,
					company: {
						companyName: 1,
						avatar: 1,
					},
				},
			},
		]);
		jobs = await jobs.toArray();
		if (jobs.length < JOB_ALERTS_NUBER) return [];
		const jobAlerts = [];
		const fileIds = [];
		jobs.forEach((doc) => {
			if (doc.company && doc.company.avatar) fileIds.push(doc.company.avatar);
		});
		let fileUrls = {};
		if (fileIds.length > 0) fileUrls = await messagingSenderService.presigneUserMedia(fileIds);
		jobs.forEach((doc) => {
			let jobLocation = 'Remote';
			if (!doc.work_remotly && doc.work_location) {
				jobLocation = `${doc.company?.companyName} - ${doc.work_location.city} ${doc.work_location.country.name}`;
			}
			jobAlerts.push({
				companyLogo: fileUrls[doc.company?.avatar] ? fileUrls[doc.company.avatar] : '',
				jobTitle: doc.title,
				jobLocation,
				postDate: doc.createdAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
				jobLink: `${CLIENT_APP_URL}/jobs/details/${doc._id}`,
			});
		});
		const developers = await NotificationEmail.aggregate([
			{ $match: { userId: { $exists: true } } },
			{
				$lookup: {
					from: 'developers',
					localField: 'userId',
					foreignField: 'userId',
					as: 'developer',
				},
			},
			{ $unwind: '$developer' },
			{
				$project: {
					userId: 1,
					email: 1,
					firstName: '$developer.firstName',
					lastName: '$developer.lastName',
				},
			},
		]);
		const finalResults = [];
		return jobAlerts;
	}
}

export const jobSuggestionsService = new JobSuggestionsService();
