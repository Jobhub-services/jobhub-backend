import { model, Schema, Document, Types } from 'mongoose';
import { IPSubscription, SubscriptionStatus, SubscriptionType } from '@/interfaces/pSubscriptions.interface';
import User from '@/models/User';
import Subscription from '@/models/Subscription';
import PaymentMethod from '@/models/PaymentMethod';
import Promotion from '@/models/Promotion';
import { currencySchema, timezoneSchema } from '@/models/MetadataSchema';
import { ChargesStatus } from '@/interfaces/pCharges.interface';
import { addDaysToDate, getSubscriptionFeatureMessage } from '@/helpers';
import { FeatureType } from '@/interfaces/subscriptions.interface';

const featureSchema: Schema = new Schema(
	{
		feature_id: Types.ObjectId,
		slug: String,
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
		interval: {
			type: String,
			enum: SubscriptionType,
		},
		amount: Number,
		auto_renew: Boolean,
		creation_status: {
			type: String,
			enum: ChargesStatus,
			default: ChargesStatus.UNKNOWN,
		},
		status: {
			type: String,
			enum: SubscriptionStatus,
			default: SubscriptionStatus.ACTIVE,
		},
		description: String,
		metadata: Schema.Types.Mixed,
		is_new_subscription: {
			type: Boolean,
			default: true,
		},
		features: [featureSchema],
		timezone: timezoneSchema,
		currency: currencySchema,
	},
	{
		timestamps: true,
	}
);

paymentSubscriptionSchema.methods.toJSON = function () {
	const subscription = this.toObject();
	const featuresDisplayText = [];
	let renewJob = 0;
	subscription.features.forEach((feature) => {
		featuresDisplayText.push({
			featureKey: feature.slug,
			displayText: getSubscriptionFeatureMessage(feature.slug, feature.current_value),
		});
		if (feature.slug === FeatureType.CHARGE_PER_POST) renewJob = feature.total_value;
	});
	let days = 30;
	if (subscription.interval === SubscriptionType.YEARLY) days = 365;
	const expireAt = addDaysToDate(subscription.createdAt, days);
	return {
		subscriptionId: subscription.subscriptionId._id || subscription.subscriptionId,
		subscriptionType: subscription.interval,
		title: subscription.subscriptionId?.title,
		description: subscription.subscriptionId?.description,
		amount: subscription.amount,
		status: subscription.status,
		timezone: subscription.timezone.name,
		currency: subscription.currency.name,
		features: featuresDisplayText,
		subscriptionFeatures: subscription.subscriptionId?.features,
		createdAt: subscription.createdAt,
		updatedAt: subscription.updatedAt,
		renewJob,
		expireAt,
	};
};

const PaymentSubscription = model<IPSubscription & Document>('PaymentSubscription', paymentSubscriptionSchema);

export default PaymentSubscription;
