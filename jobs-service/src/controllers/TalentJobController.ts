
import { Request, Response } from 'express';
import CompanyJob, { normalizetoJSON, normalizetoJSONs } from '@/models/CompanyJob';
import { isValidObjectId } from '@/helpers';

class TalentJobController {
    getJobs = async (req: Request, res: Response) => {
        try {
            const { name = '', limit = 20, page } = req.query;
            const count = await CompanyJob.count();
            //avatar ?: string;
            //featured ?: boolean;
            //applied ?: boolean;
            //saved ?: boolean;
            const query = CompanyJob.find(
                { status: 'ready' },
                { title: 1, job_type: 1, duration: 1, start_salary: 1, end_salary: 1, salary_type: 1, createdAt: 1, updatedAt: 1, hire_remotly: 1, work_remotly: 1 }
            )
                .populate({ path: 'category' })
                .populate('currency')
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
                })
                .populate({
                    path: 'createdBy',
                    select: 'companyInfo',
                })
                .sort({ updatedAt: -1 });
            const jobs = await query;
            const result = normalizetoJSONs(jobs);
            res.status(200).send({ content: result, count, size: jobs.length, pages: Math.floor(count / Number(limit)), currentPage: page });
        } catch {
            res.status(500).send({ message: 'Something went wrong please try again' });
        }
    }
    getJob = async (req: Request, res: Response) => {
        try {
            const jobId = req.params.jobid;
            if (!jobId || !isValidObjectId(jobId)) return res.status(406).send({ message: 'Job not found' });
            const query = CompanyJob.findOne({ _id: jobId })
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
                })
                .populate({
                    path: 'createdBy',
                    populate: {
                        path: 'companyInfo'
                    }
                });
            const job = await query;
            if (!job) return res.status(406).send({ message: 'Job not found' });
            const result = normalizetoJSON(job);
            res.status(200).send({ content: result });
        } catch {
            res.status(500).send({ message: 'Something went wrong please try again' });
        }
    }
}

export default TalentJobController;