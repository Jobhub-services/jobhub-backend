import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { normalizeTalentDetailtoJSON } from './../models/Application';
import { ApplicationDto } from '@/dtos/application.dto';
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
			const query = Application.find(queryConditions)
				.populate({
					path: 'jobId',
					select: ['title'],
				})
				.populate({
					path: 'companyId',
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
			const result = normalizetoJSONs(applications);
			res.status(200).send({ content: result, count, size: applications.length, pages: Math.ceil(count / Number(limit)), currentPage: page });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	getJobApplications = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const jobId = req.params.jobId;
			if (!isValidObjectId(jobId) || !(await CompanyJob.exists({ _id: jobId, createdBy: rootObjectId })))
				return res.status(406).send({ message: 'Access to job not allowed' });
			const { name = '', limit = 20, page } = req.query;
			const queryConditions = { jobId };
			const count = await Application.count({ queryConditions });
			const query = Application.find(queryConditions);
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

	getJobApplication = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const applicationId = req.params.applicationId;
			if (!isValidObjectId(applicationId)) return res.status(406).send({ message: 'Application not found' });
			let application;

			if (user.userType === UserType.DEVELOPER) {
				application = await Application.findOne({ _id: applicationId, userId: user._id })
					.populate({
						path: 'jobId',
						populate: [
							{
								path: 'createdBy',
								select: ['_id'],
								populate: {
									path: 'companyInfo',
									select: ['companyName'],
								},
							},
							{ path: 'category' },
							{ path: 'currency' },
							{ path: 'work_location', populate: { path: 'country' } },
							{ path: 'hire_location', populate: { path: 'country' } },
							{ path: 'skills' },
						],
					})
					.populate({
						path: 'responses',
						populate: {
							path: 'question',
							model: 'JobQuestion',
						},
					});
				if (application) {
					const companyId = application.jobId.createdBy._id;
					let companyInfo = await Company.findOne({ userId: companyId }).populate({
						path: 'headquarter',
						populate: { path: 'country', select: ['name'] },
					});
					application = normalizeTalentDetailtoJSON(application, companyInfo);
				}
			} else {
				application = await Application.aggregate([
					{
						$match: {
							_id: new Types.ObjectId(applicationId as string),
							companyId: user._id,
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
							start_date: '$start_date',
							notice_period: '$notice_period',
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
							status: '$status',
							userId: '$user._id',
							responses: { 'question.question': 1, response: 1 },
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
				]);
				application = application?.length! > 0 ? application[0] : null;
			}

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
		} catch {}
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

	private async _talentApplication() {}
}
export default ApplicationController;
