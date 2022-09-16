import { model, Schema, Types, Document } from 'mongoose';
import User from '@/models/User';

const paymentSubscriptionSchema: Schema = new Schema({
	userId: { type: Types.ObjectId, ref: User },
	features: Schema.Types.Mixed,
});

const PaymentSubscription = model<Document>('PaymentSubscription', paymentSubscriptionSchema);

export default PaymentSubscription;
