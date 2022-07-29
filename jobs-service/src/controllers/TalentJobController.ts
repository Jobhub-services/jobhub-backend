import { Request, Response } from 'express';
import { Types } from 'mongoose';
import CompanyJob, { normalizetoJSON, normalizetoJSONs } from '@/models/CompanyJob';
import { isValidObjectId } from '@/helpers';
import { JobStatus, SalaryType } from '@/interfaces/companyJob.interface';
import Application from '@/models/Application';
import Company from '@/models/Company';
import { stringify } from 'querystring';
import Developer from '@/models/Developer';

class TalentJobController {
	getJobs = async (req: Request, res: Response) => {
		try {
			const { name = '', limit = 20, page, os } = req.query;
			const rootObjectId = req.rootObjectId;
			const developer: any = await Developer.findOne({ userId: rootObjectId });
			let applications: any = await Application.find({ userId: rootObjectId });
			applications = applications.map((item) => item.jobId);
			let queryConditions: any = { status: { $ne: JobStatus.CLOSED }, _id: { $nin: applications } };
			queryConditions = this._buildQuery(req, queryConditions);
			let count = 0;
			if (os && os === '1') count = (developer.savedJobs ?? []).length;
			else count = await CompanyJob.count(queryConditions);
			const limitFilters = [];
			let pageN;
			const limitN = Number(limit);
			if (page) {
				pageN = Number(page);
				limitFilters.push({ $skip: pageN * limitN });
			}
			limitFilters.push({ $limit: limitN });
			const query = CompanyJob.aggregate([
				{
					$addFields: {
						saved: {
							$in: ['$_id', developer.savedJobs],
						},
					},
				},
				{ $match: queryConditions },
				{ $sort: { createdAt: -1 } },
				...limitFilters,
				{
					$lookup: {
						from: Company.collection.collectionName,
						localField: 'createdBy',
						foreignField: 'userId',
						as: 'company',
					},
				},
				{ $unwind: '$company' },
				{
					$project: {
						title: 1,
						job_type: 1,
						duration: 1,
						start_salary: 1,
						end_salary: 1,
						salary_type: 1,
						createdAt: 1,
						updatedAt: 1,
						hire_remotly: 1,
						createdBy: 1,
						work_remotly: 1,
						work_location: {
							country: '$work_location.country.name',
							city: '$work_location.city',
						},
						category: '$category.name',
						currency: {
							code: '$currency.code',
							name: '$currency.name',
						},
						company: {
							companyName: 1,
							avatar: 1,
							company_size: '$company.generalinfo.company_size',
						},
						saved: '$saved',
					},
				},
			]);

			const jobs = await query;
			res.status(200).send({ content: jobs, count, size: jobs.length, pages: Math.ceil(count / limitN), currentPage: pageN });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getJob = async (req: Request, res: Response) => {
		try {
			const jobId = req.params.jobid;
			if (!jobId || !isValidObjectId(jobId)) return res.status(406).send({ message: 'Job not found' });
			const query = CompanyJob.findById(jobId).populate({
				path: 'company',
				select: { companyName: 1, company_size: '$generalinfo.company_size', avatar: 1 },
			});
			const job = await query;
			if (!job) return res.status(406).send({ message: 'Job not found' });
			const result = normalizetoJSON(job, true);
			res.status(200).send({ content: result });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	saveJob = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const data = req.body;
			if (!data.jobId || !isValidObjectId(data.jobId)) return res.status(406).send({ message: 'Job not found' });
			const developer: any = await Developer.findOne({ userId: rootObjectId });
			if (data.saveJob && (developer.savedJobs ?? []).some((elem) => elem.toString() === data.jobId))
				return res.status(406).send({ message: 'Job aleardy saved' });
			if (data.saveJob) developer.savedJobs = [data.jobId, ...(developer.savedJobs ?? [])];
			else developer.savedJobs = (developer.savedJobs ?? []).filter((elem) => elem.toString() !== data.jobId);
			await developer.save();
			res.status(200).send({ message: 'Your job saved successfully' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	private _buildQuery(req: Request, query: any) {
		const { job_categories, skills, company_size, job_type, work_remotly, work_location, currencies, hourly, monthly, annually, sort, os } =
			req.query;
		let tmp = { ...query },
			locationCond = [],
			salaryCond = [];

		if (os && os === '1') tmp = { saved: true, ...tmp };
		if (skills?.length > 0) tmp = { 'skills._id': { $in: (skills as string[])?.map((elem) => new Types.ObjectId(elem)) }, ...tmp };
		if (job_categories?.length > 0) tmp = { 'category._id': { $in: (job_categories as string[])?.map((elem) => new Types.ObjectId(elem)) }, ...tmp };
		if (work_remotly === 'true') locationCond = [{ work_remotly: true }];
		if (work_location?.length > 0)
			locationCond = [
				{ 'work_location.country._id': { $in: (work_location as string[])?.map((elem) => new Types.ObjectId(elem)) } },
				...locationCond,
			];
		if (locationCond?.length > 0) tmp = { $or: locationCond, ...tmp };
		if (job_type?.length > 0) tmp = { $or: [{ job_type: { $in: job_type } }, { duration: { $in: job_type } }], ...tmp };
		if (hourly?.length > 0) salaryCond = ['Hourly', ...salaryCond];
		if (monthly?.length > 0) salaryCond = ['Monthly', ...salaryCond];
		if (annually?.length > 0) salaryCond = ['Yearly', ...salaryCond];
		console.log('salary ', salaryCond);
		if (salaryCond.length > 0) tmp = { salary_type: { $in: salaryCond }, ...tmp };

		return tmp;
	}
}

export default TalentJobController;
