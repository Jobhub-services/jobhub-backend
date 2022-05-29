import { Schema } from 'mongoose';
import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UserType } from '@/interfaces/users.interface';
import { JobTypes } from '@/interfaces/companyJob.interface';
import { isEmptyMessage, isStringMessage, isEnumMessage } from '@/config/dto.config';
import { Expose, Type } from 'class-transformer';
import { IsObjectId, IsExists } from '@/helpers';
import Language from '@/models/Language';
import Country from '@/models/Country';

class LanguagesDto {
	@Expose()
	@IsExists(Language)
	language: Schema.Types.ObjectId;

	@Expose()
	@IsString()
	level: string;
}

class RolesDto {
	@Expose()
	@IsOptional()
	@IsString({ each: true })
	other_roles: string[];

	@Expose()
	@IsString()
	primary_role: string;
}

class ExperiencesDto {
	@Expose()
	@IsOptional()
	@IsString()
	title: string;

	@Expose()
	@IsOptional()
	@IsString()
	company_name: string;

	@Expose()
	@IsOptional()
	@IsString()
	startDate: string;

	@Expose()
	@IsOptional()
	@IsString()
	endDate: string;

	@Expose()
	@IsOptional()
	@IsString()
	description: string;

	@Expose()
	@IsOptional()
	@IsEnum(JobTypes, { message: isEnumMessage('Job type', JobTypes) })
	job_type: JobTypes;

	@Expose()
	@IsOptional()
	@IsExists(Country)
	location: Schema.Types.ObjectId;
}

class EducationsDto {}

class CertificationsDto {}

class SocialsDto {}

export class DeveloperDto {
	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Summary') })
	summary: string;

	@Expose()
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => LanguagesDto)
	languages: LanguagesDto[];

	@Expose()
	@IsOptional()
	@IsObjectId({ each: true })
	skills: string[];

	@Expose()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => RolesDto)
	role: RolesDto;

	@Expose()
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ExperiencesDto)
	work_experience: ExperiencesDto[];

	@Expose()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => EducationsDto)
	educations: EducationsDto[];

	@Expose()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => CertificationsDto)
	certifications: CertificationsDto[];

	@Expose()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => SocialsDto)
	social_profile: SocialsDto;
}
