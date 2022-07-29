import { model, Schema, Types, Document } from 'mongoose';
import CompanyJob from '@/models/CompanyJob';

const developerSchema: Schema = new Schema({
	savedJobs: [
		{
			type: Types.ObjectId,
			ref: CompanyJob,
		},
	],
});

const Developer = model<Document>('Developer', developerSchema);

export default Developer;
