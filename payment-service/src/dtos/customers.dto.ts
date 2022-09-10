import { IsNotEmpty, IsNumber, IsObject, IsString, ValidateNested } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { IPhone } from '@/interfaces/pCustomers.interface';

export class PaymentCustomerDto {
	@Expose()
	@IsNotEmpty()
	@IsString()
	address: string;

	@Expose()
	@IsNotEmpty()
	@IsString()
	city: string;

	@Expose()
	@IsNotEmpty()
	@IsString()
	zipCode: string;

	@Expose()
	@IsNotEmpty()
	@IsString()
	region: string;

	@Expose()
	@IsObject()
	country: {
		_id?: string;
		name?: string;
	};

	@Expose()
	@IsNotEmpty()
	@IsString()
	firstName: string;

	@Expose()
	@IsNotEmpty()
	@IsString()
	lastName: string;

	@Expose()
	@IsNotEmpty()
	@IsString()
	email: string;

	@Expose()
	phone: IPhone;
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

	@Expose()
	@IsNotEmpty()
	@IsString()
	last_four: string;

	@Expose()
	issuer: { bank: string; country: string; id: string };
}

export class PaymentMergedDto extends PaymentMethodDto {
	@Expose()
	@ValidateNested({
		each: true,
	})
	@ValidateNested({ each: true })
	@Type(() => PaymentCustomerDto)
	customer: PaymentCustomerDto;
}
