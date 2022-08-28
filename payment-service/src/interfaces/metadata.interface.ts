import { Types } from 'mongoose';

export interface ICurrencyData {
	_id: Types.ObjectId;
	code: string;
	name: string;
}

export interface ITimezoneData {
	_id: Types.ObjectId;
	code: string;
	name: string;
	utc: string;
}
