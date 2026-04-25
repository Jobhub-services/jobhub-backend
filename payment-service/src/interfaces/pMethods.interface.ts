import { Types } from 'mongoose';

export interface IPMethods {
	userId?: Types.ObjectId;
	card_id?: string;
	card_token?: string;
	last4?: string;
	exp_year?: number;
	exp_month?: number;
	brand?: string;
	name?: string;
	default?: boolean;
}
