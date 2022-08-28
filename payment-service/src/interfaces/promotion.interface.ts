import { Types } from 'mongoose';
export enum PromotionType {
	FOR_SUBSCRIPTION = 'for-subscription',
	FOR_CHARGE = 'for-charge',
}

export enum PromotionStatus {
	ACTIVE = 'active',
	ARCHIVED = 'archived',
}

export interface IPromotion {
	allowed_users: Types.ObjectId[] | 'all';
	discount_amount: number;
	type: PromotionType;
	promotion_code: string;
	status: PromotionStatus;
}
