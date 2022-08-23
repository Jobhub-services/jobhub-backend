import { model, Schema, Document, Types } from 'mongoose';
import { IPCustomer } from '@/interfaces/pCustomers.interface';
import User from '@/models/User';
import { currencySchema } from '@/models/MetadataSchema';

const paymentCustomerSchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		customer_id: String,
		currency: currencySchema,
		title: String,
		live_mode: Boolean,
		object: String,
		metadata: Schema.Types.Mixed,
		api_version: String,
	},
	{
		timestamps: true,
	}
);

const PaymentCustomer = model<IPCustomer & Document>('PaymentCustomer', paymentCustomerSchema);

export default PaymentCustomer;
