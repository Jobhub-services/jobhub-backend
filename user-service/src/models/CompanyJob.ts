import { model, Schema, Types, Document } from 'mongoose';
import Company from '@/models/Company';
import User from '@/models/User';
const companyJobSchema: Schema = new Schema({
	createdBy: {
		type: Types.ObjectId,
		ref: User,
	},
});
companyJobSchema.virtual('company', { ref: Company, localField: 'createdBy', foreignField: 'userId', justOne: true });
const CompanyJob = model<Document>('CompanyJob', companyJobSchema);

export default CompanyJob;
