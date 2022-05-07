import { model, Schema, Document } from 'mongoose';
import { IJobCategory } from '@/interfaces/jobCategory.interface';
const jobCategorySchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		industry: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

const JobCategory = model<IJobCategory & Document>('JobCategory', jobCategorySchema);

export default JobCategory;
