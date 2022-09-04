import { model, Schema, Document, Types } from 'mongoose';
import { IPSubscription, SubscriptionStatus, SubscriptionType } from '@/interfaces/pSubscriptions.interface';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import PaymentMethod from '@/models/PaymentMethod';
import Promotion from '@/models/Promotion';
import { currencySchema, timezoneSchema } from '@/models/MetadataSchema';

const featureSchema: Schema = new Schema(
	{
		feature_id: Types.ObjectId,
		total_value: Number,
		current_value: Number,
	},
	{
		_id: false,
	}
);

const paymentSubscriptionSchema: Schema = new Schema(
	{
		userId: { type: Types.ObjectId, ref: User },
		subscriptionId: { type: Types.ObjectId, ref: Subscription },
		payment_method: { type: Types.ObjectId, ref: PaymentMethod },
		promotion_id: { type: Types.ObjectId, ref: Promotion },
		subscription_id: String,
		interval: SubscriptionType,
		amount: Number,
		auto_renew: Boolean,
		status: {
			type: String,
			enum: SubscriptionStatus,
			default: SubscriptionStatus.ACTIVE,
		},
		description: String,
		metadata: Schema.Types.Mixed,
		features: [featureSchema],
		timezone: timezoneSchema,
		currency: currencySchema,
	},
	{
		timestamps: true,
	}
);

const PaymentSubscription = model<IPSubscription & Document>('PaymentSubscription', paymentSubscriptionSchema);

export default PaymentSubscription;
