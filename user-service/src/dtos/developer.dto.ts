import { Types } from 'mongoose';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JobTypes } from '@/interfaces/companyJob.interface';
import { isStringMessage, isEnumMessage } from '@/config/dto.config';
import { Expose, Type } from 'class-transformer';
import { IsObjectId, IsUnique } from '@/helpers';
import { AvailabilityStatus } from '@/interfaces/developer.interface';
import User from '@/models/User';
import { PhoneDto } from '@/dtos/common.dto';

class LanguagesDto {
	@Expose()
	@IsObjectId()
	language?: Types.ObjectId;

	@Expose()
	@IsString()
	level?: string;
}

class RolesDto {
	@Expose()
	@IsOptional()
	@IsObjectId({ each: true })
	other_roles?: Types.ObjectId[];

	@Expose()
	@IsOptional()
	@IsObjectId()
	primary_role?: Types.ObjectId;

	@Expose()
	@IsOptional()
	experience?: string;
}

class ExperiencesDto {
	@Expose()
	@IsOptional()
	@IsString()
	title?: string;

	@Expose()
	@IsOptional()
	@IsString()
	company_name?: string;

	@Expose()
	@IsOptional()
	@IsString()
	startDate?: string;

	@Expose()
	@IsOptional()
	@IsString()
	endDate?: string;

	@Expose()
	@IsOptional()
	@IsString()
	description?: string;

	@Expose()
	@IsOptional()
	@IsEnum(JobTypes, { message: isEnumMessage('Job type', JobTypes) })
	job_type?: JobTypes;

	@Expose()
	@IsOptional()
	@IsObjectId()
	location?: Types.ObjectId;
}

class EducationsDto {
	@Expose()
	@IsOptional()
	@IsString()
	title?: string;

	@Expose()
	@IsOptional()
	@IsString()
	school?: string;

	@Expose()
	@IsOptional()
	@IsString()
	startDate?: string;

	@Expose()
	@IsOptional()
	@IsString()
	endDate?: string;
}

class CertificationsDto {
	@Expose()
	@IsOptional()
	@IsString()
	certificationId?: string;

	@Expose()
	@IsOptional()
	@IsString()
	title?: string;

	@Expose()
	@IsOptional()
	@IsString()
	provider?: string;

	@Expose()
	@IsOptional()
	@IsString()
	description?: string;

	@Expose()
	@IsOptional()
	@IsString()
	issuedDate?: string;

	@Expose()
	@IsOptional()
	@IsString()
	expirationDate?: string;

	@Expose()
	@IsOptional()
	@IsString()
	link?: string;
}

class SocialsDto {
	@Expose()
	@IsOptional()
	@IsString()
	website?: string;

	@Expose()
	@IsOptional()
	@IsString()
	git?: string;

	@Expose()
	@IsOptional()
	@IsString()
	linkedin?: string;

	@Expose()
	@IsOptional()
	@IsString()
	twitter?: string;
}

class AddressDto {
	@Expose()
	@IsOptional()
	@IsObjectId()
	country?: Types.ObjectId;

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('City') })
	city?: string;

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Street') })
	street?: string;
}

export class DeveloperDto {
	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Summary') })
	summary?: string;

	@Expose()
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => LanguagesDto)
	languages?: LanguagesDto[];

	@Expose()
	@IsOptional()
	@IsObjectId({ each: true })
	skills?: Types.ObjectId[];

	@Expose()
	@IsOptional()
	@ValidateNested()
	@Type(() => RolesDto)
	role?: RolesDto;

	@Expose()
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ExperiencesDto)
	work_experience?: ExperiencesDto[];

	@Expose()
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => EducationsDto)
	educations?: EducationsDto[];

	@Expose()
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CertificationsDto)
	certifications?: CertificationsDto[];

	@Expose()
	@IsOptional()
	@ValidateNested()
	@Type(() => SocialsDto)
	social_profile?: SocialsDto;

	@Expose()
	@IsOptional()
	@ValidateNested()
	@Type(() => AddressDto)
	address?: AddressDto;

	@Expose()
	@IsOptional()
	@IsObjectId()
	currency?: Types.ObjectId;

	@Expose()
	@IsOptional()
	@IsObjectId({ each: true })
	desired_location?: Types.ObjectId[];

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Salary') })
	salary?: string;

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Job Type') })
	job_type?: string;

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Other Job Type'), each: true })
	other_job_type?: string[];

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Wants') })
	wants?: string;

	@Expose()
	@IsOptional()
	@IsEnum(AvailabilityStatus)
	status?: AvailabilityStatus;
}

export class UpdateDeveloperDto {
	@Expose()
	@IsOptional()
	@IsString()
	firstName?: string;

	@Expose()
	@IsOptional()
	@IsString()
	lastName?: string;

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
