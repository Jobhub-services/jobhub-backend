import { model, Schema, Document, Types } from 'mongoose';
import { IPTransaction, TransactionTypes } from '@/interfaces/pTransaction.interface';
import { ChargesStatus } from '@/interfaces/pCharges.interface';

const paymentTransactionSchema: Schema = new Schema(
	{
		reference_id: Types.ObjectId,
		transactionType: {
			type: String,
			enum: TransactionTypes,
		},
		charge_id: String,
		status: {
			type: String,
			enum: ChargesStatus,
		},
		amount: Number,
		currency: String,
		transaction: {
			url: String,
			timezone: String,
			created: String,
			authorization_id: String,
		},
		description: String,
		metadata: Schema.Types.Mixed,
	},
	{
		timestamps: true,
	}
);

const PaymentTransaction = model<IPTransaction & Document>('PaymentTransaction', paymentTransactionSchema);

export default PaymentTransaction;
