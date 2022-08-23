import { Types } from 'mongoose';

export interface IPMethods {
	userId: Types.ObjectId;
	card_token: string;
	card_bin: string;
	card_brand: string;
	card_type: string;
	card_category: string;
	card_scheme: string;
	country_name: string;
	country: string;
	website: string;
	phone: string;
}
