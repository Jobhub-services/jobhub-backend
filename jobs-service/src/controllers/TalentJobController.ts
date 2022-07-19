import { Request, Response } from 'express';
import CompanyJob, { normalizetoJSON, normalizetoJSONs } from '@/models/CompanyJob';
import { isValidObjectId } from '@/helpers';
import { JobStatus } from '@/interfaces/companyJob.interface';
import Application from '@/models/Application';

class TalentJobController {
	getJobs = async (req: Request, res: Response) => {
		try {
			const { name = '', limit = 20, page } = req.query;
			const rootObjectId = req.rootObjectId;
			let applications: any = await Application.find({ userId: rootObjectId });
			applications = applications.map((item) => item.jobId);
			const queryConditions = { status: { $ne: JobStatus.CLOSED }, _id: { $nin: applications } };
			const count = await CompanyJob.count(queryConditions);
			const query = CompanyJob.find(queryConditions, {
				title: 1,
				job_type: 1,
				duration: 1,
				start_salary: 1,
				end_salary: 1,
				salary_type: 1,
				createdAt: 1,
				updatedAt: 1,
				hire_remotly: 1,
				work_remotly: 1,
			})
				.populate({ path: 'company', select: 'companyName generalinfo.company_size' })
				.sort({ updatedAt: -1 });
			if (limit) {
				const limitN = Number(limit);
				query.limit(limitN);
				if (page) {
					const pageN = Number(page);
					query.skip(pageN * limitN);
				}
			}
			const jobs = await query;
			console.log(jobs);
			const result = normalizetoJSONs(jobs);
			res.status(200).send({ content: result, count, size: jobs.length, pages: Math.ceil(count / Number(limit)), currentPage: page });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getJob = async (req: Request, res: Response) => {
		try {
			const jobId = req.params.jobid;
			if (!jobId || !isValidObjectId(jobId)) return res.status(406).send({ message: 'Job not found' });
			const query = CompanyJob.findById(jobId).populate({ path: 'company', select: 'companyName generalinfo.company_size' });

			const job = await query;
			if (!job) return res.status(406).send({ message: 'Job not found' });
			console.log(job);
			const result = normalizetoJSON(job, true);
			res.status(200).send({ content: result });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

export default TalentJobController;
