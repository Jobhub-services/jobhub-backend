import { Request, Response } from 'express';
import { ICompanyJob, JobLocation } from '@/interfaces/companyJob.interface';
import { CompanyJobDto } from '@/dtos/jobs.dto';
import Company from '@/models/Company';
import CompanyJob, { normalizetoJSON, normalizetoJSONs } from '@/models/CompanyJob';
import { isValidObjectId } from '@/helpers';
import { metadataService } from '@/services/MetadataService';
import Application from '@/models/Application';

class CompanyJobController {
	createJob = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const jobBody: CompanyJobDto = req.body;
			const company = await Company.findOne({ userId: rootObjectId });

			const jobs = [];
			const work_location = jobBody.work_location;
			const work_remotly = jobBody.work_remotly;
			const hire_location = await this._populateHireLocations(jobBody.hire_location);
			const skills = await metadataService.getSkills(jobBody.skills);
			const currency = await metadataService.getCurrency(jobBody.currency);
			const category = await metadataService.getJobCategory(jobBody.category);
			const questions = this._populateQuestions(jobBody.questions);
			const company_division = company.company_division.find((division) => division._id == jobBody.company_division);

			const createJobInstance = async (location?: ICompanyJob['work_location']) => {
				const companyJob: ICompanyJob = {
					title: jobBody.title,
					description: jobBody.description,
					responsabilities: jobBody.responsabilities,
					company_division,
					category,
					currency,
					job_type: jobBody.job_type,
					duration: jobBody.duration,
					duration_range: jobBody.duration_range,
					salary_type: jobBody.salary_type,
					start_salary: jobBody.start_salary,
					end_salary: jobBody.end_salary,
					benefits: jobBody.benefits,
					work_remotly,
					hire_remotly: jobBody.hire_remotly,
					visa_sponsorship: jobBody.visa_sponsorship,
					work_location: location,
					hire_location,
					education: jobBody.education,
					certification: jobBody.certification,
					skills,
					requirements: jobBody.requirements,
					questions,
					createdBy: rootObjectId,
					updatedBy: rootObjectId,
				};
				const job = await CompanyJob.create(companyJob);
				jobs.push(job);
			};
			if (work_remotly) await createJobInstance();
			else
				for (const workLocation of work_location) {
					const location = await metadataService.getCountry(workLocation.country);
					if (!location) continue;
					await createJobInstance({
						city: workLocation.city,
						country: location,
					});
				}
			res.status(200).send({ message: 'Job created successfully', countCreated: jobs.length });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	getJobs = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const query = req.query;
			const { name = '', limit = 20, page } = req.query;
			let sort = parseInt((query.sort as string) ?? '-1') as 1 | -1;
			if (!sort) sort = -1;

			const count = await CompanyJob.count({ createdBy: rootObjectId });
			const myJobs = await CompanyJob.aggregate([
				{
					$match: {
						createdBy: rootObjectId,
					},
				},
				{
					$lookup: {
						from: Application.collection.collectionName,
						localField: '_id',
						foreignField: 'jobId',
						as: 'applications',
						pipeline: [
							{
								$match: {
									$expr: {
										$and: [
											{
												$eq: ['$status', 'NEW'],
											},
										],
									},
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
								$project: {
									avatar: '$user.avatar',
								},
							},
						],
					},
				},
				{
					$project: {
						_id: '$_id',
						title: '$title',
						category: '$category.name',
						company_division: '$company_division.name',
						currency: {
							code: '$currency.code',
							name: '$currency.name',
						},
						skills: '$skills.name',

						work_location: {
							country: '$work_location.country.name',
							city: '$work_location.city',
						},

						description: '$description',
						status: '$status',
						job_type: '$job_type',
						duration: '$duration',
						start_salary: '$start_salary',
						end_salary: '$end_salary',
						work_remotly: '$work_remotly',
						salary_type: '$salary_type',

						createdAt: '$createdAt',
						updatedAt: '$updatedAt',
						applications: '$applications.avatar',
					},
				},
				{ $sort: { createdAt: sort } },
			]);

			/*const query = CompanyJob.find(
				{ createdBy: rootObjectId },
				{ title: 1, description: 1, status: 1, job_type: 1, duration: 1, start_salary: 1, end_salary: 1, createdAt: 1, updatedAt: 1, createdBy: 1 }
			)
				.populate({
					path: 'applications',
					populate: {
						path: 'developer',
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
			}*/
			//const jobs = await query;
			//const result = normalizetoJSONs(jobs);
			res.status(200).send({ content: myJobs, count, size: myJobs.length, pages: Math.ceil(count / Number(limit)), currentPage: page });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	getJob = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const jobId = req.params.jobid;
			if (!jobId || !isValidObjectId(jobId)) return res.status(406).send({ message: 'Job not found' });
			const query = CompanyJob.findOne({ _id: jobId, createdBy: rootObjectId });
			const job = await query;
			if (!job) return res.status(406).send({ message: 'Job not found' });
			const result = normalizetoJSON(job);
			res.status(200).send({ content: result });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	editJob = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const jobId = req.params.jobid;
			if (!jobId || !isValidObjectId(jobId)) return res.status(406).send({ message: 'Job not found' });
			const query = CompanyJob.findOne({ id: jobId, createdBy: rootObjectId });
			const job = await query;
			if (!job) return res.status(406).send({ message: 'Job not found' });
			const result = {
				...job.toJSON(),
				questions: job.questions?.map((question) => {
					return question.question;
				}),
			};
			res.status(200).send({ content: result });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	updateJob = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const jobId = req.params.jobid;
			const jobBody: CompanyJobDto = req.body;
			if (!jobId || !isValidObjectId(jobId)) return res.status(406).send({ message: 'Job not found' });
			const job = await CompanyJob.findOne({ id: jobId, createdBy: rootObjectId });
			if (!job) return res.status(406).send({ message: 'Job not found' });

			// update properties
			if (jobBody.title) job.title = jobBody.title;
			if (jobBody.description) job.description = jobBody.description;
			if (jobBody.responsabilities) job.responsabilities = jobBody.responsabilities;
			if (jobBody.company_division && isValidObjectId(jobBody.company_division)) {
				const company = await Company.findOne({ userId: rootObjectId });
				const company_division = company.company_division.find((division) => division._id == jobBody.company_division);
				if (company_division) job.company_division = company_division;
			}
			if (jobBody.category) {
				const category = await metadataService.getJobCategory(jobBody.category);
				if (category) job.category = category;
			}
			if (jobBody.currency) {
				const currency = await metadataService.getCurrency(jobBody.currency);
				if (currency) job.currency = currency;
			}
			if (jobBody.job_type) job.job_type = jobBody.job_type;
			if (jobBody.duration) job.duration = jobBody.duration;
			if (jobBody.duration_range) job.duration_range = jobBody.duration_range;
			if (jobBody.salary_type) job.salary_type = jobBody.salary_type;
			if (jobBody.start_salary) job.start_salary = jobBody.start_salary;
			if (jobBody.end_salary) job.end_salary = jobBody.end_salary;
			if (jobBody.benefits) job.benefits = jobBody.benefits;
			if (jobBody.work_remotly) job.work_remotly = jobBody.work_remotly;
			if (jobBody.hire_remotly) job.hire_remotly = jobBody.hire_remotly;
			if (jobBody.visa_sponsorship) job.visa_sponsorship = jobBody.visa_sponsorship;
			//if (jobBody.work_location) job.work_location = jobBody.work_location;
			if (jobBody.hire_location) job.hire_location = await this._populateHireLocations(jobBody.hire_location);
			if (jobBody.education) job.education = jobBody.education;
			if (jobBody.certification) job.certification = jobBody.certification;
			if (jobBody.skills) job.skills = await metadataService.getSkills(jobBody.skills);
			if (jobBody.requirements) job.requirements = jobBody.requirements;
			job.updatedBy = rootObjectId;
			await job.save();
			res.status(200).send({ message: 'Job updated successfully' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	deleteJob = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const jobId = req.params.jobid;
			if (!jobId || !isValidObjectId(jobId)) return res.status(406).send({ message: 'Job not found' });
			const job = await CompanyJob.delete({ id: jobId, createdBy: rootObjectId });
			if (!job) return res.status(406).send({ message: 'Job not found' });
			res.status(200).send({ message: 'Job deleted successfully' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	restoreJob = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const jobId = req.params.jobid;
			if (!jobId || !isValidObjectId(jobId)) return res.status(406).send({ message: 'Job not found' });
			const job = await CompanyJob.findOneDeleted({ id: jobId, createdBy: rootObjectId });
			if (!job) return res.status(406).send({ message: 'Job not found' });
			await job.restore();
			res.status(200).send({ message: 'Job restored successfully' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	private _populateHireLocations = async (locations: CompanyJobDto['hire_location']): Promise<ICompanyJob['hire_location']> => {
		const hire_location: ICompanyJob['hire_location'] = [];
		for (const location of locations) {
			const country = await metadataService.getCountry(location.country);
			if (country)
				hire_location.push({
					city: location.city,
					country,
				});
		}
		return hire_location;
	};

	private _populateQuestions = (questions: CompanyJobDto['questions']): ICompanyJob['questions'] => {
		const qsts: ICompanyJob['questions'] = questions.map((qst) => {
			return {
				question: qst,
			};
		});

		return qsts;
	};
}
export default CompanyJobController;
