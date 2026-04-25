import { model, Schema, Document, Types } from 'mongoose';
import { IPromotion, PromotionType, PromotionStatus } from '@/interfaces/promotion.interface';

const promotionSchema: Schema = new Schema(
	{
		allowed_users: Schema.Types.Mixed,
		discount_amount: Number,
		type: {
			type: String,
			enum: PromotionType,
		},
		promotion_code: String,
		status: {
			type: String,
			enum: PromotionStatus,
		},
	},
	{
		timestamps: true,
	}
);

const Promotion = model<IPromotion & Document>('Promotion', promotionSchema);

export default Promotion;
