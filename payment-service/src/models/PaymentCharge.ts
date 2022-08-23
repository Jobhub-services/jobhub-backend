import { model, Schema, Document } from 'mongoose';
import { IPCharge } from '@/interfaces/pCharges.interface';

const paymentChargeSchema: Schema = new Schema(
	{},
	{
		timestamps: true,
	}
);

const PaymentCharge = model<IPCharge & Document>('PaymentCharge', paymentChargeSchema);

export default PaymentCharge;
