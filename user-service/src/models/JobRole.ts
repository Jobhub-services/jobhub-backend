import { model, Schema, Document } from 'mongoose';
import { IJobRole } from '@/interfaces/jobRole.interface';
const jobRoleSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);
jobRoleSchema.index({ name: 'text' });

const JobRole = model<IJobRole & Document>('JobRole', jobRoleSchema);

export default JobRole;
