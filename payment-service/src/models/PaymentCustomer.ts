import { model, Schema, Document, Types } from 'mongoose';
import { IPCustomer } from '@/interfaces/pCustomers.interface';
import User from '@/models/User';
import { countrySchema, currencySchema } from '@/models/MetadataSchema';

const paymentCustomerSchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		customer_id: String,
		currency: currencySchema,
		title: String,
		metadata: Schema.Types.Mixed,
		address: String,
		city: String,
		zipCode: String,
		region: String,
		country: countrySchema,
	},
	{
		timestamps: true,
	}
);

const PaymentCustomer = model<IPCustomer & Document>('PaymentCustomer', paymentCustomerSchema);

export default PaymentCustomer;
