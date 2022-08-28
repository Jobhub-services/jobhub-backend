import { model, Schema, Types, Document } from 'mongoose';
import User from '@/models/User';

const companySchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
	},
	{
		timestamps: true,
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

const Company = model<Document>('Company', companySchema);

export default Company;
