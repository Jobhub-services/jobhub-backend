import { Types } from 'mongoose';

export enum ChargesStatus {
	INITIATED = 'INITIATED',
	ABANDONED = 'ABANDONED',
	CANCELLED = 'CANCELLED',
	FAILED = 'FAILED',
	DECLINED = 'DECLINED',
	RESTRICTED = 'RESTRICTED',
	CAPTURED = 'CAPTURED',
	VOID = 'VOID',
	TIMEDOUT = 'TIMEDOUT',
	UNKNOWN = 'UNKNOWN',
}

export interface ITapCharge {
	amount: number;
	currency: string;
	description: string;
	save_card?: boolean;
	receipt?: {
		email?: boolean;
	};
	customer?: {
		id?: string;
		first_name?: string;
		last_name?: string;
		email?: string;
		phone?: {
			country_code?: string;
			number?: string;
		};
	};
	source?: {
		id?: string;
	};
	post?: {
		url?: string;
	};
	redirect?: {
		url?: string;
	};
}

export interface IPCharge {
	userId?: Types.ObjectId;
	payment_method?: Types.ObjectId;
	status?: ChargesStatus;
	charge_id?: string;
	amount?: number;
	quantity?: number;
	description?: string;
	transaction?: {
		authorization_id?: string;
		timezone?: string;
		created?: string;
		url?: string;
	};
	metadata?: any;
}
