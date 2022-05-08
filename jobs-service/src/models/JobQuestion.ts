import { Schema } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { softDeleteModel } from '@/helpers';
import { IJobQuestion } from '@/interfaces/jobQuestion.interface';

const jobQuestionSchema: Schema = new Schema({
	job_id: { type: Schema.Types.ObjectId, ref: 'CompanyJob' },
	question: {
		type: String,
		required: true,
	},
});

jobQuestionSchema.plugin(MongooseDelete, { deletedAt: true, overrideMethods: true });

const JobQuestion = softDeleteModel<IJobQuestion>('JobQuestion', jobQuestionSchema);

export default JobQuestion;
