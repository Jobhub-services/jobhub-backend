import { model, Schema, Types, Document } from 'mongoose';
import User from '@/models/User';
import CompanyJob from '@/models/CompanyJob';

const developerSchema: Schema = new Schema({
	userId: { type: Types.ObjectId, ref: User },
	savedJobs: [
		{
			type: Types.ObjectId,
			ref: CompanyJob,
		},
	],
});

const Developer = model<Document>('Developer', developerSchema);

export default Developer;
