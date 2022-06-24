import { Schema, Types } from 'mongoose';
import { ApplicationDto } from "@/dtos/application.dto";
import { IApplication } from "@/interfaces/application.interface";
import { ICompanyJob } from "@/interfaces/companyJob.interface";
import { IUser } from "@/interfaces/users.interface";
import Application from "@/models/Application";
import CompanyJob from "@/models/CompanyJob";
import User from "@/models/User";
import { Request, Response } from "express";
import { isValidObjectId } from '@/helpers';


class ApplicationController {
    createApp = async (req: Request, res: Response) => {
        try {
            const rootObjectId = req.rootObjectId;
            const appBody: ApplicationDto = req.body;
            if (!appBody.jobId || !isValidObjectId(appBody.jobId)) return res.status(406).send({ message: 'Job not found' });
            const companyJob = await CompanyJob.findById(appBody.jobId)
            const profile = await User.findById(rootObjectId);
            if (this._isApplicationSubmited(profile, appBody.jobId)) return res.status(200).send({ message: 'You have submited an application' });
            const application: IApplication = {
                resume: appBody.resume,
                questions: appBody.questions as any,
                start_date: appBody.start_date,
                notice_period: appBody.notice_period
            };
            const app = await Application.create(application);
            this._setUserApplications(profile, app._id, appBody.jobId)
            profile.save()
            this._setJobApplications(companyJob, app._id, rootObjectId)
            companyJob.save()
            res.status(200).send({ message: 'Application submited successfully', jobId: appBody.jobId });
        } catch (e: any) {
            console.log(e);
            res.status(500).send({ message: 'Something went wrong please try again' });
        }
    }
    getApplications = async (req: Request, res: Response) => {
        try {
            const rootObjectId = req.rootObjectId;
            const { name = '', limit = 20, page } = req.query;
            const query = User.findOne(rootObjectId)
                .populate({
                    path: 'developerInfo',
                    populate: {
                        path: 'applications',
                        populate: {
                            path: 'application',
                        }
                    }
                })
            const applications = await query;
            res.status(200).send({ content: applications, size: 10, currentPage: page });
        } catch {
            res.status(500).send({ message: 'Something went wrong please try again' });
        }
    }
    private _setUserApplications = (profile: IUser, appId: Schema.Types.ObjectId, jobId: Schema.Types.ObjectId) => {
        let profileApps = profile.developerInfo.applications
        profileApps.push({ application: appId, job: jobId })
        profile.developerInfo.applications = profileApps
    };
    private _setJobApplications = (job: ICompanyJob, appId: Schema.Types.ObjectId, userId: Schema.Types.ObjectId) => {
        let jobApps = job.applications
        jobApps.push({ application: appId, user: userId })
        job.applications = jobApps
    };
    private _isApplicationSubmited = (profile: IUser, jobId: Schema.Types.ObjectId): boolean => {
        return profile.developerInfo.applications.some(elem => String(elem.job) === String(jobId))
    }
}
export default ApplicationController;