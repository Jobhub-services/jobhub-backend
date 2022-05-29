import { Schema } from 'mongoose';
import { IsArray, IsEnum, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JobTypes } from '@/interfaces/companyJob.interface';
import { isStringMessage, isEnumMessage } from '@/config/dto.config';
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

class EducationsDto {
	@Expose()
	@IsOptional()
	@IsString()
	title: string;

	@Expose()
	@IsOptional()
	@IsString()
	school: string;

	@Expose()
	@IsOptional()
	@IsString()
	startDate: string;

	@Expose()
	@IsOptional()
	@IsString()
	endDate: string;
}

class CertificationsDto {
	@Expose()
	@IsOptional()
	@IsString()
	certificationId: string;

	@Expose()
	@IsOptional()
	@IsString()
	title: string;

	@Expose()
	@IsOptional()
	@IsString()
	provider: string;

	@Expose()
	@IsOptional()
	@IsString()
	description: string;

	@Expose()
	@IsOptional()
	@IsString()
	issuedDate: string;

	@Expose()
	@IsOptional()
	@IsString()
	expirationDate: string;

	@Expose()
	@IsOptional()
	@IsString()
	link: string;
}

class SocialsDto {
	@Expose()
	@IsOptional()
	@IsString()
	website: string;

	@Expose()
	@IsOptional()
	@IsString()
	git: string;

	@Expose()
	@IsOptional()
	@IsString()
	linkedin: string;

	@Expose()
	@IsOptional()
	@IsString()
	twitter: string;
}

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
	skills: Schema.Types.ObjectId[];

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
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => EducationsDto)
	educations: EducationsDto[];

	@Expose()
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => CertificationsDto)
	certifications: CertificationsDto[];

	@Expose()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => SocialsDto)
	social_profile: SocialsDto;
}
