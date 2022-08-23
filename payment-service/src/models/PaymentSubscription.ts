import { model, Schema, Document, Types } from 'mongoose';
import { IPSubscription, SubscriptionStatus, SubscriptionType } from '@/interfaces/pSubscriptions.interface';
import User from '@/models/User';
import Subscription from '@/models/Subscription';

const featureSchema: Schema = new Schema({
	feature_id: Types.ObjectId,
	total_value: Number,
	current_value: Number,
});

const paymentSubscriptionSchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		subscriptionId: { type: Types.ObjectId, ref: Subscription },
		renew_type: SubscriptionType,
		payed_amount: Number,
		auto_renew: Boolean,
		status: SubscriptionStatus,
		features: [featureSchema],
	},
	{
		timestamps: true,
	}
);

const PaymentSubscription = model<IPSubscription & Document>('PaymentSubscription', paymentSubscriptionSchema);

export default PaymentSubscription;
