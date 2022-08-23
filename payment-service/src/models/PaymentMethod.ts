import { model, Schema, Document, Types } from 'mongoose';
import { IPMethods } from '@/interfaces/pMethods.interface';
import User from '@/models/User';

const paymentMethodSchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		card_token: String,
		card_bin: String,
		card_brand: String,
		card_type: String,
		card_category: String,
		card_scheme: String,
		country_name: String,
		country: String,
		website: String,
		phone: String,
	},
	{
		timestamps: true,
	}
);

const PaymentMethod = model<IPMethods & Document>('PaymentMethod', paymentMethodSchema);

export default PaymentMethod;
