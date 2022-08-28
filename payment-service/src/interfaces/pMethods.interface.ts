import { Types } from 'mongoose';

export interface IPMethods {
	userId: Types.ObjectId;
	card_id: string;
	card_token: string;
	last_four: string;
	exp_year: string;
	exp_month: string;
	brand: string;
	client_ip: string;
	name: string;
	funding: string;
}
