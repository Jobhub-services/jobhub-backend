import { Schema } from 'mongoose';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JobTypes } from '@/interfaces/companyJob.interface';
import { isStringMessage, isEnumMessage } from '@/config/dto.config';
import { Expose, Type } from 'class-transformer';
import { IsExists } from '@/helpers';
import Language from '@/models/Language';
import Country from '@/models/Country';
import JobRole from '@/models/JobRole';
import Skill from '@/models/Skill';
import Currency from '@/models/Currency';
import { AvailabilityStatus } from '@/interfaces/developer.interface';

class LanguagesDto {
	@Expose()
	@IsExists(Language)
	language?: Schema.Types.ObjectId;

	@Expose()
	@IsString()
	level?: string;
}

class RolesDto {
	@Expose()
	@IsOptional()
	@IsExists(JobRole, { each: true })
	other_roles?: Schema.Types.ObjectId[];

	@Expose()
	@IsOptional()
	@IsExists(JobRole)
	primary_role?: Schema.Types.ObjectId;

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
	@IsExists(Country)
	location?: Schema.Types.ObjectId;
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
	@IsExists(Country)
	country?: Schema.Types.ObjectId;

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
	@IsExists(Skill, { each: true })
	skills?: Schema.Types.ObjectId[];

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
	@IsExists(Currency)
	currency?: Schema.Types.ObjectId;

	@Expose()
	@IsOptional()
	@IsExists(Country, { each: true })
	desired_location?: Schema.Types.ObjectId[];

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
