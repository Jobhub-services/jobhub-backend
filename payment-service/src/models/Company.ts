import { model, Schema, Document, Types } from 'mongoose';
import User from '@/models/User';

const companySchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
	},
	{
		timestamps: true,
	}
);

const Company = model<any & Document>('Company', companySchema);

export default Company;
