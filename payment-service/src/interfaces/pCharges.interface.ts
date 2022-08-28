import { Types } from 'mongoose';

export interface IPCharge {
	userId: Types.ObjectId;
	payment_method: Types.ObjectId;
	promotion_id: Types.ObjectId;
	amout: Number;
	description: String;
	metadata: any;
}
