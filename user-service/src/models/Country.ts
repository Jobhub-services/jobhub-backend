import { model, Schema, Document } from 'mongoose';
import { ICountry } from '@/interfaces/country.interface';
const countrySchema: Schema = new Schema(
	{
		code: {
			type: String,
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Country = model<ICountry & Document>('Country', countrySchema);

export default Country;
