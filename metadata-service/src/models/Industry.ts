import { model, Schema, Document } from 'mongoose';
import { IIndustry } from '@/interfaces/industry.interface';

const industrySchema: Schema = new Schema({
	name: {
		type: String,
		required: true,
	},
});

const Industry = model<IIndustry & Document>('Industry', industrySchema);

export default Industry;
