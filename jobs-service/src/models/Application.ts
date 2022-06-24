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

export default Company;