import { Types } from 'mongoose';
import { ICurrencyData } from '@/interfaces/metadata.interface';

export type ITapCustomer = {
	first_name: string;
	middle_name?: string;
	last_name: string;
	email: string;
	phone: {
		country_code?: string;
		number?: string;
	};
	description: string;
	currency: string;
};

export interface IPCustomer {
	userId?: Types.ObjectId;
	customer_id?: string;
	currency?: ICurrencyData;
	title?: string;
	metadata?: any;
}
