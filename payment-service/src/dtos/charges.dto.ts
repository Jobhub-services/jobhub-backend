import { Types } from 'mongoose';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { IsExists } from '@/helpers';
import PaymentMethod from '@/models/PaymentMethod';

export class ChargePostDto {
	@Expose()
	@IsOptional()
	@IsExists(PaymentMethod)
	paymentMethodId?: Types.ObjectId;

	@Expose()
	@IsNotEmpty()
	@IsNumber()
	quantity: number;
}
