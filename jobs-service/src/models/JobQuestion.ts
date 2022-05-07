import { model, Schema, Document } from 'mongoose';
import { IJobQuestion } from '@/interfaces/jobQuestion.interface';

const jobQuestionSchema: Schema = new Schema({
	job_id: { type: Schema.Types.ObjectId, ref: 'CompanyJob' },
	question: {
		type: String,
		required: true,
	},
});

const JobQuestion = model<IJobQuestion & Document>('JobQuestion', jobQuestionSchema);

export default JobQuestion;
