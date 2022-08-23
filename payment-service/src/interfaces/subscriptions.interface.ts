import { ICurrencyData } from '@/interfaces/metadata.interface';

export enum FeatureType {
	POSTING_NUMBER = 'posting-number',
	POSTING_DURATION = 'posting-duration',
	CHARGE_PER_POST = 'charge-per-post',
	CONTACTS_NUMBER = 'contacts-number',
}

type FeatureDetail = {
	slug: FeatureType;
	description: string;
	value: number;
};

export interface ISubscription {
	monthly_amount: number;
	yearly_amount: number;
	currency: ICurrencyData;
	features: FeatureDetail[];
}
