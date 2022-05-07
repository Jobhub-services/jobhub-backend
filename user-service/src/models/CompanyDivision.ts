import { model, Schema, Document } from 'mongoose';
import { ICompanyDivision } from '@/interfaces/company.interface';

const companyDivisionSchema: Schema = new Schema({
	company_id: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
});

const CompanyDivision = model<ICompanyDivision & Document>('CompanyDivision', companyDivisionSchema);

export default CompanyDivision;
