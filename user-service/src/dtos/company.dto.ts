import { Types } from 'mongoose';
import { IsUnique, IsObjectId } from '@/helpers';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import User from '@/models/User';
import { PhoneDto } from '@/dtos/common.dto';

class SocialsDto {
	@Expose()
	@IsOptional()
	@IsString()
	twitter?: string;

	@Expose()
	@IsOptional()
	@IsString()
	linkedin?: string;

	@Expose()
	@IsOptional()
	@IsString()
	facebook?: string;

	@Expose()
	@IsOptional()
	@IsString()
	website?: String;
}

class GeneralInfoDto {
	@Expose()
	@IsOptional()
	@IsString()
	founded?: string;

	@Expose()
	@IsOptional()
	@IsString()
	industry?: string;

	@Expose()
	@IsOptional()
	@IsString()
	company_size?: string;
}

class HeadquarterDto {
	@Expose()
	@IsObjectId()
	country: Types.ObjectId;

	@Expose()
	@IsOptional()
	@IsString()
	city?: string;

	@Expose()
	@IsOptional()
	@IsString()
	street?: string;
}

export class CompanyDto {
	@Expose()
	@IsOptional()
	@IsString()
	description?: string;

	@Expose()
	@IsOptional()
	@IsString()
	companyName?: string;

	@Expose()
	@IsOptional()
	@ValidateNested()
	@Type(() => SocialsDto)
	social_profile?: SocialsDto;

	@Expose()
	@IsOptional()
	@ValidateNested()
	@Type(() => GeneralInfoDto)
	generalinfo?: GeneralInfoDto;

	@Expose()
	@IsOptional()
	@ValidateNested()
	@Type(() => HeadquarterDto)
	headquarter?: HeadquarterDto;

	@Expose()
	@IsOptional()
	@IsArray()
	keywords?: string[];

	@Expose()
	@IsOptional()
	@IsArray()
	company_division?: string[];

	@Expose()
	@IsOptional()
	@IsObjectId()
	currency?: Types.ObjectId;

	@Expose()
	@IsOptional()
	@IsObjectId()
	timezone?: Types.ObjectId;
}

export class UpdateCompanyDto {
	@Expose()
	@IsOptional()
	@IsString()
	companyName?: string;

	@Expose()
	@IsOptional()
	@IsString()
	owner_first_name?: string;

	@Expose()
	@IsOptional()
	@IsString()
	owner_last_name?: string;

	@Expose()
	@IsOptional()
	@IsUnique(User, {}, 'email')
	email?: string;

	@Expose()
	@IsOptional()
	@ValidateNested()
	@Type(() => PhoneDto)
	phone?: PhoneDto;

	@Expose()
	@IsOptional()
	@IsUnique(User, {}, 'username')
	username?: string;
}
