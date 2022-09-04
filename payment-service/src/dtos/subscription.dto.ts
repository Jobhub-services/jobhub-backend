import { Types } from 'mongoose';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { isEnumMessage } from '@/config/dto.config';
import { Expose, Type } from 'class-transformer';
import Subscription from '@/models/Subscription';
import { IsExists } from '@/helpers';
import { SubscriptionType } from '@/interfaces/pSubscriptions.interface';

export class PaymentSubscriptionDto {
	@Expose()
	@IsNotEmpty()
	@IsExists(Subscription)
	subscriptionId: Types.ObjectId;

	@Expose()
	@IsNotEmpty()
	@IsEnum(SubscriptionType, { message: isEnumMessage('subscription type', SubscriptionType) })
	subscriptionType: SubscriptionType;
}
