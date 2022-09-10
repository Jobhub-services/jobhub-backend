import { Types } from 'mongoose';
import { IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { Expose } from 'class-transformer';

export class PhoneDto {
	@Expose()
	@IsNotEmpty()
	@IsString()
	country_code: string;

	@Expose()
	@IsNotEmpty()
	@IsString()
	number: string;
}

export class BillingDto {
	@Expose()
	@IsOptional()
	@IsString()
	address: string;

	@Expose()
	@IsOptional()
	@IsString()
	city: string;

	@Expose()
	@IsOptional()
	@IsString()
	zipCode: string;

	@Expose()
	@IsOptional()
	@IsString()
	region: string;

	@Expose()
	@IsObject()
	country: {
		_id?: Types.ObjectId;
		name?: string;
	};

	@Expose()
	@IsOptional()
	@IsString()
	first_name: string;

	@Expose()
	@IsOptional()
	@IsString()
	last_name: string;

	@Expose()
	@IsOptional()
	@IsString()
	email: string;

	@Expose()
	phone: PhoneDto;
}
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
}
