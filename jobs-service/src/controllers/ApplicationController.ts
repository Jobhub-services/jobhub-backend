import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { normalizeTalentDetailtoJSON } from './../models/Application';
import { ApplicationDto, InterviewDto } from '@/dtos/application.dto';
import { IApplication, ApplicationStatus } from '@/interfaces/application.interface';
import { ICompanyJob } from '@/interfaces/companyJob.interface';
import { IsObjectId, isValidObjectId } from '@/helpers';
import { UserType } from '@/interfaces/users.interface';
import Application, { normalizetoJSONs } from '@/models/Application';
import CompanyJob from '@/models/CompanyJob';
import Company from '@/models/Company';
import User from '@/models/User';

class ApplicationController {
	createApp = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const appBody: ApplicationDto = req.body;
			const applicationJob = await CompanyJob.findById(appBody.jobId);
			const responses = await this._populateResponses(applicationJob.questions, appBody.responses);
			const application: IApplication = {
				userId: rootObjectId,
				companyId: applicationJob.createdBy,
				jobId: appBody.jobId,
				motivation: appBody.motivation,
				responses,
				start_date: appBody.start_date,
				notice_period: appBody.notice_period,
			};
			const createdApplication = await Application.create(application);
			res.status(200).send({ message: 'Application submited successfully', application: createdApplication });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	updateApplication = async (req: Request, res: Response) => {
		try {
		} catch {}
	};
	updateApplicationStatus = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const applicationId = req.params.applicationId;
			if (!isValidObjectId(applicationId)) return res.status(406).send({ message: 'Application not found' });
			const appBody = req.body;
			if (!(appBody.status in ApplicationStatus)) return res.status(406).send({ message: 'Status value not valid' });
			let application = await Application.findOne({ _id: applicationId, companyId: user._id });
			application.status = appBody.status;
			await application.save();
			res.status(200).send({ status: appBody.status, updated: true });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getMyApplications = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const { name = '', limit = 20, page } = req.query;
			const queryConditions = { userId: rootObjectId };
			const count = await Application.count(queryConditions);
			const query = Application.find(queryConditions, { companyId: 1, jobId: 1, motivation: 1, status: 1, updatedAt: 1, createdAt: 1 })
				.populate({
					path: 'company',
					select: { companyName: 1, avatar: 1 },
				})
				.populate({
					path: 'jobId',
					select: { title: 1 },
				})
				.sort({ updatedAt: -1 });

			if (limit) {
				const limitN = Number(limit);
				query.limit(limitN);
				if (page) {
					const pageN = Number(page);
					query.skip(pageN * limitN);
				}
			}
			const applications = await query;
			res.status(200).send({ content: applications, count, size: applications.length, pages: Math.ceil(count / Number(limit)), currentPage: page });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	getApplicationForDeveloper = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const applicationId = req.params.applicationId;
			const application = await this._getApplicationDetail(applicationId, user._id, user.userType);
			if (!application) return res.status(406).send({ message: 'Application not found' });
			res.status(200).send({ content: application });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	getApplicationForCompany = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const applicationId = req.params.applicationId;
			const application = await this._getApplicationDetail(applicationId, user._id, user.userType);
			if (!application) return res.status(406).send({ message: 'Application not found' });
			res.status(200).send({ content: application });
			if (!application) return res.status(406).send({ message: 'Application not found' });
			res.status(200).send({ content: application });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	/**
	 *
	 * get list of jobs for company
	 * @param req query:
	 * @param res list of jobs
	 */
	getCompanyJobApplications = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			//process queries

			const { name = '', limit = 20, page } = req.query;
			const query = req.query;
			const byJob = query.byJob;
			let status: ApplicationStatus = (query.status ?? ApplicationStatus.NEW) as ApplicationStatus;
			let sort = parseInt((query.sort as string) ?? '-1') as 1 | -1;
			let statusArray = [];

			if (!(status in ApplicationStatus)) statusArray.push(ApplicationStatus.NEW);
			else {
				statusArray.push(status);
				if (status === ApplicationStatus.ACCEPTED) statusArray.push(ApplicationStatus.IN_PROGRESS);
				if (status === ApplicationStatus.IN_PROGRESS) statusArray.push(ApplicationStatus.ACCEPTED);
			}
			if (!sort) sort = -1;

			let result = null;
			if (byJob === 'true') {
				result = await Application.aggregate([
					{
						$match: {
							companyId: rootObjectId,
							status: { $in: statusArray },
						},
					},
					{
						$lookup: {
							from: 'developers',
							localField: 'userId',
							foreignField: 'userId',
							as: 'user',
						},
					},
					{ $unwind: '$user' },
					{
						$group: {
							_id: '$jobId',
							applications: {
								$push: {
									_id: '$_id',
									motivation: '$motivation',
									avatar: '$user.avatar',
									firstName: '$user.firstName',
									lastName: '$user.lastName',
									role: {
										primary_role: '$user.role.primary_role.name',
										experience: '$user.role.experience',
									},
									userStatus: '$user.status',
									skills: '$user.skills.name',
									linkedIn: '$user.social_profile.linkedin',
									git: '$user.social_profile.git',
									cv: '$user.resume',
									status: '$status',
									userId: '$userId',
									createdAt: '$createdAt',
									updatedAt: '$updatedAt',
								},
							},
						},
					},
					{
						$lookup: {
							from: CompanyJob.collection.collectionName,
							localField: '_id',
							foreignField: '_id',
							as: 'job',
						},
					},
					{ $unwind: '$job' },
					{
						$project: {
							_id: 0,
							applications: { $slice: ['$applications', 2] },
							title: '$job.title',
							createdAt: '$job.createdAt',
							updatedAt: '$job.updatedAt',
							job_id: '$job._id',
							category: '$job.category.name',
						},
					},
					{ $sort: { createdAt: sort } },
				]);
			} else {
				let matchDict: any = {
					companyId: rootObjectId,
					status: { $in: statusArray },
				};
				const jobId = query.jobId as string;
				if (jobId) matchDict['jobId'] = new Types.ObjectId(jobId);
				result = await Application.aggregate([
					{
						$match: {
							...matchDict,
						},
					},
					{
						$lookup: {
							from: 'developers',
							localField: 'userId',
							foreignField: 'userId',
							as: 'user',
						},
					},
					{ $unwind: '$user' },
					{
						$lookup: {
							from: CompanyJob.collection.collectionName,
							localField: 'jobId',
							foreignField: '_id',
							as: 'job',
						},
					},
					{ $unwind: '$job' },
					{
						$project: {
							_id: '$_id',
							motivation: '$motivation',
							avatar: '$user.avatar',
							firstName: '$user.firstName',
							lastName: '$user.lastName',
							role: {
								primary_role: '$user.role.primary_role.name',
								experience: '$user.role.experience',
							},
							userStatus: '$user.status',
							skills: '$user.skills.name',
							linkedIn: '$user.social_profile.linkedin',
							git: '$user.social_profile.git',
							cv: '$user.resume',
							status: '$status',
							userId: '$userId',
							createdAt: '$createdAt',
							updatedAt: '$updatedAt',
							job: {
								title: '$job.title',
								createdAt: '$job.createdAt',
								updatedAt: '$job.updatedAt',
								job_id: '$job._id',
								category: '$job.category.name',
							},
						},
					},
					{ $sort: { createdAt: sort } },
				]);
			}
			res
				.status(200)
				.send({ content: result, count: result.length, size: result.length, pages: Math.ceil(result.length / Number(limit)), currentPage: page });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	createInterview = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const applicationId = new Types.ObjectId(req.params.applicationId);
			const application = await Application.findOne({ _id: applicationId, companyId: rootObjectId });
			if (!application) return res.status(404).send({ message: 'Application not found' });
			const interviewBody: InterviewDto = req.body;
			const interviewsList = application.interviews || [];
			interviewsList.push(interviewBody);
			application.interviews = interviewsList;
			await application.save();
			res.status(200).send({ content: interviewBody });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	updateInterview = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const applicationId = new Types.ObjectId(req.params.applicationId);
			const application = await Application.findOne({ _id: applicationId, companyId: rootObjectId });
			if (!application) return res.status(404).send({ message: 'Application not found' });
			const interviewId = String(req.params.interviewId);
			const interviewBody: InterviewDto = req.body;
			const interviewsList = (application.interviews || []).map((interview) => {
				if (String(interview._id) == interviewId)
					return {
						...interview,
						...interviewBody,
					};
				return interview;
			});
			application.interviews = interviewsList;
			await application.save();
			res.status(200).send({ content: 'Interview updated' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	deleteInterview = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const applicationId = new Types.ObjectId(req.params.applicationId);
			const application = await Application.findOne({ _id: applicationId, companyId: rootObjectId });
			if (!application) return res.status(404).send({ message: 'Application not found' });
			const interviewId = String(req.params.interviewId);
			const interviewsList = (application.interviews || []).filter((interview) => String(interview._id) != interviewId);
			application.interviews = interviewsList;
			await application.save();
			res.status(200).send({ content: 'Interview deleted' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	private async _populateResponses(questions: ICompanyJob['questions'], responses: ApplicationDto['responses']): Promise<IApplication['responses']> {
		const resultResponses: IApplication['responses'] = [];
		responses.forEach((response) => {
			const qst = questions.find((item) => item._id == response.question);
			if (qst)
				resultResponses.push({
					response: response.response,
					question: qst,
				});
		});
		return resultResponses;
	}

	private async _getApplicationDetail(applicationId: string, userId: Types.ObjectId, userType: UserType) {
		if (!isValidObjectId(applicationId)) return null;

		const mathFilter: any = { _id: new Types.ObjectId(applicationId as string) };
		const pipeline = [];
		const project: any = {
			_id: '$_id',
			motivation: '$motivation',
			start_date: '$start_date',
			notice_period: '$notice_period',
			status: '$status',
			createdAt: '$createdAt',
			updatedAt: '$updatedAt',
			responses: {
				$map: {
					input: '$responses',
					in: { response: '$$this.response', question: '$$this.question.question' },
				},
			},
			avatar: '$user.avatar',
			firstName: '$user.firstName',
			lastName: '$user.lastName',
			role: {
				primary_role: '$user.role.primary_role.name',
				experience: '$user.role.experience',
			},
			userStatus: '$user.status',
			work_experience: '$user.work_experience',
			skills: '$user.skills.name',
			linkedIn: '$user.social_profile.linkedin',
			website: '$user.social_profile.website',
			git: '$user.social_profile.git',
			cv: '$user.resume',
			userId: '$user._id',
			job: {
				title: '$job.title',
				createdAt: '$job.createdAt',
				updatedAt: '$job.updatedAt',
				job_id: '$job._id',
				category: '$job.category.name',
			},
		};
		if (userType === UserType.DEVELOPER) {
			mathFilter.userId = userId;
			pipeline.push({
				$lookup: {
					from: Company.collection.collectionName,
					localField: 'companyId',
					foreignField: 'userId',
					as: 'company',
				},
			});
			pipeline.push({ $unwind: '$company' });
			project.company = {
				description: '$company.description',
				social_profile: '$company.social_profile',
				keywords: '$company.keywords',
				companyName: '$company.companyName',
				avatar: '$company.avatar',
				company_division: '$company.company_division.name',
			};
		} else if (userType === UserType.COMPANY) {
			mathFilter.companyId = userId;
			project.interviews = '$interviews';
		}
		let application = await Application.aggregate([
			{
				$match: mathFilter,
			},
			{
				$lookup: {
					from: 'developers',
					localField: 'userId',
					foreignField: 'userId',
					as: 'user',
				},
			},
			{ $unwind: '$user' },
			{
				$lookup: {
					from: CompanyJob.collection.collectionName,
					localField: 'jobId',
					foreignField: '_id',
					as: 'job',
				},
			},
			{ $unwind: '$job' },
			...pipeline,
			{
				$project: project,
			},
		]);
		application = application[0];
		return application;
	}
}
export default ApplicationController;
