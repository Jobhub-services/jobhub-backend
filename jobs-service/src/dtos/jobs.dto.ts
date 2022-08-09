import { Types } from 'mongoose';
import { IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JobTypes, JobDuration, SalaryType } from '@/interfaces/companyJob.interface';
import { isEmptyMessage, isStringMessage, isEnumMessage } from '@/config/dto.config';
import { Expose, Type } from 'class-transformer';
import { IsObjectId } from '@/helpers';

class JobLocationDto {
	@Expose()
	@IsObjectId()
	country: Types.ObjectId;

	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('City') })
	@IsString({ message: isStringMessage('City') })
	city: string;
}

export class CompanyJobDto {
	@Expose()
	@IsOptional()
	@IsNotEmpty({ message: isEmptyMessage('Job title') })
	@IsString({ message: isStringMessage('Job title') })
	title: string;

	@Expose()
	@IsOptional()
	@IsNotEmpty({ message: isEmptyMessage('Job description') })
	@IsString({ message: isStringMessage('Job description') })
	description: string;

	@Expose()
	@IsOptional()
	//@IsNotEmpty({ message: isEmptyMessage('Job responsabilities') })
	@IsString({ message: isStringMessage('Job responsabilities') })
	responsabilities: string;

	@Expose()
	@IsOptional()
	@IsObjectId()
	company_division: Types.ObjectId;

	@Expose()
	@IsOptional()
	@IsNotEmpty({ message: isEmptyMessage('Job category') })
	@IsObjectId()
	category: Types.ObjectId;

	@Expose()
	@IsOptional()
	@IsNotEmpty({ message: isEmptyMessage('Job type') })
	@IsEnum(JobTypes, { message: isEnumMessage('Job type', JobTypes) })
	job_type: JobTypes;

	@Expose()
	@IsOptional()
	//@IsNotEmpty({ message: isEmptyMessage('Job duration') })
	@IsEnum(JobDuration, { message: isEnumMessage('Job duration', JobDuration) })
	duration: JobDuration;

	@Expose()
	@IsOptional()
	@IsNotEmpty({ message: isEmptyMessage('Job duration range') })
	@IsArray()
	duration_range: string[];

	@Expose()
	@IsOptional()
	//@IsNotEmpty({ message: isEmptyMessage('Job salary type') })
	@IsEnum(SalaryType, { message: isEnumMessage('Job salary type', SalaryType) })
	salary_type: SalaryType;

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Job start salary') })
	start_salary: string;

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Job end salary') })
	end_salary: string;

	@Expose()
	@IsOptional()
	@IsObjectId()
	currency: Types.ObjectId;

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Job benefits') })
	benefits: string;

	@Expose()
	@IsOptional()
	@IsBoolean({ message: isStringMessage('Work remotly') })
	work_remotly: boolean;

	@Expose()
	@IsOptional()
	@IsBoolean({ message: isStringMessage('Hire remotly') })
	hire_remotly: boolean;

	@Expose()
	@IsOptional()
	@IsBoolean({ message: isStringMessage('Visa sponsorship') })
	visa_sponsorship: boolean;

	@Expose()
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => JobLocationDto)
	work_location: JobLocationDto[];

	@Expose()
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => JobLocationDto)
	hire_location: JobLocationDto[];

	@Expose()
	@IsOptional()
	education: string[];

	@Expose()
	@IsOptional()
	certification: string[];

	@Expose()
	@IsOptional()
	@IsArray()
	@IsObjectId({ each: true })
	skills: Types.ObjectId[];

	@Expose()
	@IsOptional()
	requirements: string;

	@Expose()
	@IsOptional()
	@IsArray()
	questions: string[];
}
