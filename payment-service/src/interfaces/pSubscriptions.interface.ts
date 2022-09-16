import { Types } from 'mongoose';
import { ITimezoneData, ICurrencyData } from '@/interfaces/metadata.interface';
import { ChargesStatus } from '@/interfaces/pCharges.interface';
import { FeatureType } from '@/interfaces/subscriptions.interface';

export enum SubscriptionType {
	MONTHLY = 'MONTHLY',
	YEARLY = 'YEARLY',
}
export enum SubscriptionStatus {
	ACTIVE = 'active',
	CANCELED = 'canceled',
}

export type ITapSubscription = {
	term: {
		interval: SubscriptionType;
		period: number;
		from: string;
		due: number;
		auto_renew: boolean;
		timezone: string;
	};
	charge: {
		amount: number;
		currency: string;
		description: string;
		receipt: {
			email: boolean;
		};
		customer: {
			id: string;
		};
		source: {
			id: string;
		};
		post?: {
			url: string;
		};
	};
};

export interface IPSubscription {
	userId?: Types.ObjectId;
	subscriptionId?: Types.ObjectId;
	payment_method?: Types.ObjectId;
	promotion_id?: Types.ObjectId;
	subscription_id?: string;
	interval?: SubscriptionType;
	amount?: number;
	auto_renew?: boolean;
	creation_status?: ChargesStatus;
	status?: SubscriptionStatus;
	description?: string;
	features?: { feature_id: Types.ObjectId; total_value: number; current_value: number; slug: FeatureType }[];
	timezone?: ITimezoneData;
	currency?: ICurrencyData;
	is_new_subscription?: boolean;
	metadata?: any;
}
