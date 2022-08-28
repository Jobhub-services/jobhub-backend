import { model, Schema, Document, Types } from 'mongoose';
import { IPMethods } from '@/interfaces/pMethods.interface';
import User from '@/models/User';

const paymentMethodSchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		card_id: String,
		card_token: String,
		last_four: String,
		exp_year: String,
		exp_month: String,
		brand: String,
		client_ip: String,
		name: String,
		funding: String,
	},
	{
		timestamps: true,
	}
);

const PaymentMethod = model<IPMethods & Document>('PaymentMethod', paymentMethodSchema);

export default PaymentMethod;
