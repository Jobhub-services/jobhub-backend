import { ApplicationDto } from '@/dtos/application.dto';
import { IApplication } from '@/interfaces/application.interface';
import Application, { normalizetoJSONs } from '@/models/Application';
import CompanyJob from '@/models/CompanyJob';
import Company from '@/models/Company';
import { Request, Response } from 'express';
import { isValidObjectId } from '@/helpers';
import JobQuestion from '@/models/JobQuestion';
import { UserType } from '@/interfaces/users.interface';

class ApplicationController {
	createApp = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const appBody: ApplicationDto = req.body;
			const isValidQeustions = await this._validateQuestions(appBody.jobId, appBody.responses);
			if (!isValidQeustions) return res.status(406).send({ message: 'Something went wrong with your answers' });
			const application: IApplication = {
				userId: rootObjectId,
				jobId: appBody.jobId,
				motivation: appBody.motivation,
				responses: appBody.responses,
				start_date: appBody.start_date,
				notice_period: appBody.notice_period,
			};
			const createdApplication = await Application.create(application);
			res.status(200).send({ message: 'Application submited successfully', application: createdApplication });
		} catch (e: any) {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	updateApplication = async (req: Request, res: Response) => {
		try {
		} catch {}
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
					populate: {
						path: 'createdBy',
						select: ['_id'],
						populate: {
							path: 'companyInfo',
							select: ['companyName'],
						},
					},
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
		} catch {
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
				application = await Application.findOne({ _id: applicationId, userId: user._id }).populate({
					path: 'jobId',
					populate: {
						path: 'createdBy',
						select: ['_id'],
						populate: {
							path: 'companyInfo',
							select: ['companyName'],
						},
					},
				});
				if (application) {
					const companyId = application.jobId.createdBy._id;
					let companyInfo = await Company.findOne({ userId: companyId });
					application = {
						...application.toJSON(),
						company: {
							...companyInfo.toJSON(),
							companyName: application.jobId?.createdBy?.companyInfo?.companyName,
						},
					};
				}
			} else {
				application = await Application.findOne({ _id: applicationId });
				// check job association
				if (application && !(await CompanyJob.exists({ _id: application.jobId, createdBy: user._id }))) application = null;
			}

			if (!application) return res.status(406).send({ message: 'Application not found' });
			res.status(200).send({ content: application });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	createInterview = async (req: Request, res: Response) => {
		try {
		} catch {}
	};

	private async _validateQuestions(jobId: IApplication['jobId'], responses: IApplication['responses']): Promise<boolean> {
		let isValidRecords = true;
		const questions = await JobQuestion.find({ job_id: jobId });
		const qstIds = questions.map((item) => item.id);
		for (const i in responses) {
			const response = responses[i];
			if (qstIds.indexOf(response.question) < 0) {
				isValidRecords = false;
				break;
			}
		}
		return isValidRecords;
	}
	private async _talentApplication() {}
}
export default ApplicationController;
