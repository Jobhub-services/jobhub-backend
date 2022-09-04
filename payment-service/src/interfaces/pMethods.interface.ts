import { Types } from 'mongoose';

export interface IPMethods {
	userId: Types.ObjectId;
	card_id: string;
	card_token: string;
	first_six: string;
	exp_year: number;
	exp_month: number;
	brand: string;
	name: string;
	funding: string;
}
