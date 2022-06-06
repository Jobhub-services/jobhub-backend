import { Request, Response } from 'express';
import { ICompanyJob, JobLocation } from '@/interfaces/companyJob.interface';
import { CompanyJobDto } from '@/dtos/jobs.dto';
import CompanyJob, { normalizetoJSON, normalizetoJSONs } from '@/models/CompanyJob';
import JobQuestion from '@/models/JobQuestion';
import CompanyDivision from '@/models/CompanyDivision';
import JobCategory from '@/models/JobCategory';
import Currency from '@/models/Currency';
import Country from '@/models/Country';
import Skill from '@/models/Skill';
import { isValidObjectId } from '@/helpers';

class CompanyJobController {
	createJob = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const jobBody: CompanyJobDto = req.body;

			const jobs = [];
			const work_location = jobBody.work_location;
			const work_remotly = jobBody.work_remotly;
			jobBody.hire_location = await this._populateHireLocations(jobBody.hire_location);
			jobBody.skills = await this._populateSkills(jobBody.skills);
			const createJobInstance = async (location?: any) => {
				const companyJob: ICompanyJob = {
					title: jobBody.title,
					description: jobBody.description,
					responsabilities: jobBody.responsabilities,
					company_division: jobBody.company_division,
					category: jobBody.category,
					currency: jobBody.currency,
					job_type: jobBody.job_type,
					duration: jobBody.duration,
					duration_range: jobBody.duration_range,
					salary_type: jobBody.salary_type,
					start_salary: jobBody.start_salary,
					end_salary: jobBody.end_salary,
					benefits: jobBody.benefits,
					work_remotly: jobBody.work_remotly,
					hire_remotly: jobBody.hire_remotly,
					visa_sponsorship: jobBody.visa_sponsorship,
					work_location: location,
					hire_location: jobBody.hire_location,
					education: jobBody.education,
					certification: jobBody.certification,
					skills: jobBody.skills,
					requirements: jobBody.requirements,
					createdBy: rootObjectId,
					updatedBy: rootObjectId,
				};
				const job = await CompanyJob.create(companyJob);
				for (const question of jobBody.questions) {
					await JobQuestion.create({
						job_id: job.id,
						question,
					});
				}
				jobs.push(job);
			};
			if (work_remotly) await createJobInstance();
			else
				for (const index in work_location) {
					const location = work_location[index];
					if (!isValidObjectId(location.country)) continue;
					const isValid = await Country.findById(location.country);
					if (!isValid) continue;
					await createJobInstance(location);
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
			const { name = '', limit = 20, page } = req.query;
			const count = await CompanyJob.count();
			const query = CompanyJob.find(
				{ createdBy: rootObjectId },
				{ title: 1, description: 1, status: 1, job_type: 1, duration: 1, start_salary: 1, end_salary: 1, createdAt: 1, updatedAt: 1 }
			)
				.populate({ path: 'category' })
				.populate('currency')
				.populate({
					path: 'work_location',
					populate: {
						path: 'country',
					},
				})
				.sort({ updatedAt: -1 });
			const jobs = await query;
			const result = normalizetoJSONs(jobs);
			res.status(200).send({ content: result, count, size: jobs.length, pages: Math.floor(count / Number(limit)), currentPage: page });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	getJob = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const jobId = req.params.jobid;
			console.log(jobId);
			if (!jobId || !isValidObjectId(jobId)) return res.status(406).send({ message: 'Job not found' });
			const query = CompanyJob.findOne({ _id: jobId, createdBy: rootObjectId })
				.populate({ path: 'category', select: 'name' })
				.populate('currency')
				.populate('skills')
				.populate('company_division')
				.populate('questions')
				.populate({
					path: 'work_location',
					populate: {
						path: 'country',
					},
				})
				.populate({
					path: 'hire_location',
					populate: {
						path: 'country',
					},
				});
			const job = await query;
			if (!job) return res.status(406).send({ message: 'Job not found' });
			const result = normalizetoJSON(job);
			res.status(200).send({ content: result });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	editJob = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const jobId = req.params.jobid;
			if (!jobId || !isValidObjectId(jobId)) return res.status(406).send({ message: 'Job not found' });
			const query = CompanyJob.findOne({ id: jobId, createdBy: rootObjectId })
				.populate({ path: 'category', select: 'name' })
				.populate('currency')
				.populate('skills')
				.populate('company_division')
				.populate('questions')
				.populate({
					path: 'work_location',
					populate: {
						path: 'country',
					},
				})
				.populate({
					path: 'hire_location',
					populate: {
						path: 'country',
					},
				});
			const job = await query;
			if (!job) return res.status(406).send({ message: 'Job not found' });
			const result = {
				...job.toJSON(),
				questions: job.questions?.map((question) => {
					return question.question;
				}),
			};
			res.status(200).send({ content: result });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	updateJob = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const jobId = req.params.jobid;
			const { body } = req;
			if (!jobId || !isValidObjectId(jobId)) return res.status(406).send({ message: 'Job not found' });
			const job = await CompanyJob.findOne({ id: jobId, createdBy: rootObjectId });
			if (!job) return res.status(406).send({ message: 'Job not found' });
			// update properties
			if (body.title) job.title = body.title;
			if (body.description) job.description = body.description;
			if (body.responsabilities) job.responsabilities = body.responsabilities;
			if (body.company_division && isValidObjectId(body.company_division)) {
				let isValid = false;
				isValid = await CompanyDivision.findById(body.company_division);
				if (isValid) job.company_division = body.company_division;
			}
			if (body.category && isValidObjectId(body.category)) {
				let isValid = false;
				isValid = await JobCategory.findById(body.category);
				if (isValid) job.category = body.category;
			}
			if (body.category && isValidObjectId(body.category)) {
				let isValid = false;
				isValid = await JobCategory.findById(body.category);
				if (isValid) job.category = body.category;
			}
			if (body.job_type) job.job_type = body.job_type;
			if (body.duration) job.duration = body.duration;
			if (body.duration_range) job.duration_range = body.duration_range;
			if (body.salary_type) job.salary_type = body.salary_type;
			if (body.start_salary) job.start_salary = body.start_salary;
			if (body.end_salary) job.end_salary = body.end_salary;
			if (body.currency && isValidObjectId(body.currency)) {
				let isValid = false;
				isValid = await Currency.findById(body.currency);
				if (isValid) job.currency = body.currency;
			}
			if (body.benefits) job.benefits = body.benefits;
			if (body.work_remotly) job.work_remotly = body.work_remotly;
			if (body.hire_remotly) job.hire_remotly = body.hire_remotly;
			if (body.visa_sponsorship) job.visa_sponsorship = body.visa_sponsorship;
			if (body.work_location) job.work_location = body.work_location;
			if (body.hire_location) job.hire_location = body.hire_location;
			if (body.education) job.education = body.education;
			if (body.certification) job.certification = body.certification;
			if (body.skills) job.skills = body.skills;
			if (body.requirements) job.requirements = body.requirements;
			job.updatedBy = rootObjectId;
			await job.save();
			res.status(200).send({ message: 'Job updated successfully' });
		} catch {
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
			await JobQuestion.delete({ job_id: jobId });
			res.status(200).send({ message: 'Job deleted successfully' });
		} catch {
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
			await JobQuestion.restore({ job_id: jobId });
			res.status(200).send({ message: 'Job restored successfully' });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	private _populateHireLocations = async (locations: JobLocation[]) => {
		const locationsResult = [];
		for (const index in locations) {
			const location = locations[index];
			if (!isValidObjectId(location.country)) continue;
			const isValid = await Country.findById(location.country);
			if (!isValid) continue;
			locationsResult.push(location);
		}
		return locationsResult;
	};

	private _populateSkills = async (skills: string[]) => {
		const skillsResult = [];
		for (const skill of skills) {
			if (!isValidObjectId(skill)) continue;
			const isValid = await Skill.findById(skill);
			if (!isValid) continue;
			skillsResult.push(skill);
		}
		return skillsResult;
	};
}
export default CompanyJobController;
