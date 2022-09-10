import { model, Schema, Document } from 'mongoose';
import { ICurrency } from '@/interfaces/currency.interface';
const currencySchema: Schema = new Schema({
	code: {
		type: String,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
});

const Currency = model<ICurrency & Document>('Currency', currencySchema);

export default Currency;
