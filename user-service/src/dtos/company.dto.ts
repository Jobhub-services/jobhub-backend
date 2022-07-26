import { Types } from 'mongoose';
import { IsObjectId } from '@/helpers';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

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
}
