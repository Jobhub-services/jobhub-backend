import { Types } from 'mongoose';
import { ChargesStatus } from '@/interfaces/pCharges.interface';

export enum TransactionTypes {
	SUBSCRIPTION_PAYMENT = 'subscription-payment',
	CHARGE_PAYMENT = 'charge-payment',
}
export interface IPTransaction {
	reference_id: Types.ObjectId;
	transactionType: TransactionTypes;
	charge_id: string;
	status: ChargesStatus;
	amount: number;
	currency: string;
	transaction: {
		url: string;
		timezone: string;
		created: string;
		authorization_id: string;
	};
	description: string;
	metadata: string;
}
