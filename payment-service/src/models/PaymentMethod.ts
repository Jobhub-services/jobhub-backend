import { model, Schema, Document, Types } from 'mongoose';
import { IPMethods } from '@/interfaces/pMethods.interface';
import User from '@/models/User';

const paymentMethodSchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		card_id: String,
		card_token: String,
		last4: String,
		exp_year: Number,
		exp_month: Number,
		brand: String,
		name: String,
		default: Boolean,
	},
	{
		timestamps: true,
	}
);

const PaymentMethod = model<IPMethods & Document>('PaymentMethod', paymentMethodSchema);

export default PaymentMethod;
