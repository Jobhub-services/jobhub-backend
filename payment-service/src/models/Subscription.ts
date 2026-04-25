import { model, Schema, Document } from 'mongoose';
import { FeatureType, ISubscription } from '@/interfaces/subscriptions.interface';
import { currencySchema } from '@/models/MetadataSchema';

const featureSchema: Schema = new Schema({
	slug: {
		type: String,
		enum: FeatureType,
	},
	title: String,
	description: String,
	value: Number,
});

const subscriptionSchema: Schema = new Schema(
	{
		title: String,
		description: String,
		monthly_amount: Number,
		yearly_amount: Number,
		currency: currencySchema,
		features: [featureSchema],
	},
	{
		timestamps: true,
	}
);

const Subscription = model<ISubscription & Document>('Subscription', subscriptionSchema);

export default Subscription;
