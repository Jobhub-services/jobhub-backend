import { Types } from 'mongoose';
import { ICurrencyData } from '@/interfaces/metadata.interface';

export interface IPCustomer {
	userId: Types.ObjectId;
	customer_id: string;
	currency: ICurrencyData;
	title: string;
	metadata: any;
}
