import { Types } from 'mongoose';
import { ICountryData, ICurrencyData } from '@/interfaces/metadata.interface';

export type IPhone = {
	country_code?: string;
	number?: string;
};
export type ITapCustomer = {
	first_name?: string;
	middle_name?: string;
	last_name?: string;
	email?: string;
	phone?: IPhone;
	description?: string;
	currency?: string;
	title?: string;
};

export interface IPCustomer {
	userId?: Types.ObjectId;
	customer_id?: string;
	currency?: ICurrencyData;
	title?: string;
	metadata?: any;
	address?: string;
	city?: string;
	zipCode?: string;
	region?: string;
	country?: ICountryData;
	first_name?: string;
	last_name?: string;
	email?: string;
	phone?: IPhone;
}
