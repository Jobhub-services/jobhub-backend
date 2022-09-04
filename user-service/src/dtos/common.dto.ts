import { IsString, IsNotEmpty } from 'class-validator';
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
