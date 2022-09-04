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

export interface IPCharge {
	userId: Types.ObjectId;
	payment_method: Types.ObjectId;
	amout: Number;
	description: String;
	metadata: any;
}
