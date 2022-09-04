import { Types } from 'mongoose';
import { ITimezoneData, ICurrencyData } from '@/interfaces/metadata.interface';
import { FeatureDetail } from '@/interfaces/subscriptions.interface';

export enum SubscriptionType {
	MONTHLY = 'MONTHLY',
	YEARLY = 'YEARLY',
}
export enum SubscriptionStatus {
	ACTIVE = 'active',
	EXPIRED = 'expired',
	CANCELED = 'canceled',
}

export type ITapSubscription = {};

export interface IPSubscription {
	userId: Types.ObjectId;
	subscriptionId: Types.ObjectId;
	payment_method: Types.ObjectId;
	promotion_id: Types.ObjectId;
	subscription_id: string;
	interval: SubscriptionType;
	amount: number;
	auto_renew: boolean;
	status: SubscriptionStatus;
	description: string;
	features: FeatureDetail[];
	timezone: ITimezoneData;
	currency: ICurrencyData;
	metadata: any;
}
