import { model, Schema, Document, Types } from 'mongoose';
import User from '@/models/User';
import PaymentMethod from '@/models/PaymentMethod';
import { IPCharge } from '@/interfaces/pCharges.interface';

const paymentChargeSchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		payment_method: { type: Types.ObjectId, ref: PaymentMethod },
		amout: Number,
		description: String,
		metadata: Schema.Types.Mixed,
	},
	{
		timestamps: true,
	}
);

const PaymentCharge = model<IPCharge & Document>('PaymentCharge', paymentChargeSchema);

export default PaymentCharge;
