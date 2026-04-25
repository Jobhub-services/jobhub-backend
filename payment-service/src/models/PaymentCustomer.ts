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
		first_name: String,
		last_name: String,
		email: String,
		phone: {
			country_code: String,
			number: String,
			_id: false,
		},
	},
	{
		timestamps: true,
	}
);

paymentCustomerSchema.methods.toJSON = function () {
	const customer = this.toObject();
	return {
		address: customer.address,
		city: customer.city,
		zipCode: customer.zipCode,
		region: customer.region,
		country: customer.country,
		first_name: customer.first_name,
		last_name: customer.last_name,
		email: customer.email,
		phone: customer.phone,
	};
};

const PaymentCustomer = model<IPCustomer & Document>('PaymentCustomer', paymentCustomerSchema);

export default PaymentCustomer;
