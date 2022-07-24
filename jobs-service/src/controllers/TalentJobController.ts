import { Request, Response } from 'express';
import CompanyJob, { normalizetoJSON, normalizetoJSONs } from '@/models/CompanyJob';
import { isValidObjectId } from '@/helpers';
import { JobStatus } from '@/interfaces/companyJob.interface';
import Application from '@/models/Application';
import Company from '@/models/Company';

class TalentJobController {
	getJobs = async (req: Request, res: Response) => {
		try {
			const { name = '', limit = 20, page } = req.query;
			const rootObjectId = req.rootObjectId;
			let applications: any = await Application.find({ userId: rootObjectId });
			applications = applications.map((item) => item.jobId);
			const queryConditions = { status: { $ne: JobStatus.CLOSED }, _id: { $nin: applications } };
			const count = await CompanyJob.count(queryConditions);
			const limitFilters = [];
			let pageN;
			const limitN = Number(limit);
			if (page) {
				pageN = Number(page);
				limitFilters.push({ $skip: pageN * limitN });
			}
			limitFilters.push({ $limit: limitN });
			const query = CompanyJob.aggregate([
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
							company_size: '$company.generalinfo.company_size',
						},
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
			const query = CompanyJob.findById(jobId).populate({ path: 'company', select: { companyName: 1, company_size: '$generalinfo.company_size' } });
			const job = await query;
			if (!job) return res.status(406).send({ message: 'Job not found' });
			const result = normalizetoJSON(job, true);
			res.status(200).send({ content: result });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

export default TalentJobController;
