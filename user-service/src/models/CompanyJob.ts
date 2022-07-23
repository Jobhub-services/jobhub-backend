import { model, Schema, Types, Document } from 'mongoose';
const companyJobSchema: Schema = new Schema({});

const CompanyJob = model<Document>('CompanyJob', companyJobSchema);

export default CompanyJob;
