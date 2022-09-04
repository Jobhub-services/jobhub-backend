import { Types } from 'mongoose';
import { ITimezoneData, ICurrencyData } from '@/interfaces/metadata.interface';

export enum SubscriptionType {
	MONTHLY = 'MONTHLY',
	YEARLY = 'YEARLY',
}
export enum SubscriptionStatus {
	ACTIVE = 'active',
	EXPIRED = 'expired',
	CANCELED = 'canceled',
	INITIATED = 'initiated',
	CREATED = 'created',
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
	};
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

export interface IPSubscription {
	userId?: Types.ObjectId;
	subscriptionId?: Types.ObjectId;
	payment_method?: Types.ObjectId;
	promotion_id?: Types.ObjectId;
	subscription_id?: string;
	interval?: SubscriptionType;
	amount?: number;
	auto_renew?: boolean;
	status?: SubscriptionStatus;
	description?: string;
	features?: { feature_id: Types.ObjectId; total_value: number; current_value: number }[];
	timezone?: ITimezoneData;
	currency?: ICurrencyData;
	metadata?: any;
}
