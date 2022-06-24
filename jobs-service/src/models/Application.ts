import { Schema, Document } from 'mongoose';
import { softDeleteModel } from '@/helpers';
import { IApplication } from '@/interfaces/application.interface';

const questionSchema: Schema = new Schema({
    question: { type: Schema.Types.ObjectId, ref: 'JobQuestions' },
    response: { type: String },
})

const applicationSchema: Schema = new Schema(
    {
        resume: {
            type: String,
            required: true,
        },
        questions: [questionSchema],
        notice_period: {
            type: String,
        },
        start_date: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
)

const Company = softDeleteModel<IApplication & Document>('Application', applicationSchema);
export const normalizetoJSON = (object: any, includeQuestion: boolean = false) => {
    const job = object.toJSON();
    return {
        ...job,
        category: job.category?.name,
        company_division: job.company_division?.name,
        currency: {
            code: job.currency?.code,
            name: job.currency?.name,
        },
        skills: job.skills?.map((skill) => {
            return skill.name;
        }),

        questions: job.questions?.map((question) => {
            if (includeQuestion) return { _id: question._id, question: question.question }
            return question.question;
        }),
        work_location: {
            country: job.work_location?.country.name,
            city: job.work_location?.city,
        },
        hire_location: job.hire_location?.map((location) => {
            return {
                country: location?.country.name,
                city: location?.city,
            };
        }),
        createdBy: {
            companyName: job?.createdBy?.companyInfo?.companyName
        }
    };
};
export default Company;