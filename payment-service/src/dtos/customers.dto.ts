import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class PaymentMethodDto {
	@Expose()
	@IsNotEmpty()
	@IsString()
	card_id: string;

	@Expose()
	@IsNotEmpty()
	@IsString()
	card_token: string;

	@Expose()
	@IsNotEmpty()
	@IsNumber()
	exp_year: number;

	@Expose()
	@IsNotEmpty()
	@IsNumber()
	exp_month: number;

	@Expose()
	@IsNotEmpty()
	@IsString()
	brand: string;

	@Expose()
	@IsNotEmpty()
	@IsString()
	name: string;

	@Expose()
	@IsNotEmpty()
	@IsString()
	funding: string;

	@Expose()
	@IsNotEmpty()
	@IsString()
	first_six: string;

	@Expose()
	@IsNotEmpty()
	@IsString()
	fingerprint: string;
}
