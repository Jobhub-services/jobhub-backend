import { model, Schema, Document } from 'mongoose';
import { ICompany } from '@/interfaces/company.interface';
const companySchema: Schema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
	},
	{
		timestamps: true,
	}
);

const Company = model<ICompany & Document>('Company', companySchema);

export default Company;
