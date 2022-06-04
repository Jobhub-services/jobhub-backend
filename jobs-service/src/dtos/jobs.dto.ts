import { ArrayNotEmpty, IsArray, IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { JobTypes, JobDuration, SalaryType } from '@/interfaces/companyJob.interface';
import { isEmptyMessage, isStringMessage, isEnumMessage } from '@/config/dto.config';
import { Expose, Type } from 'class-transformer';
import { IsExists } from '@/helpers';
import CompanyDivision from '@/models/CompanyDivision';
import JobCategory from '@/models/JobCategory';
import Currency from '@/models/Currency';

class JobLocationDto {
	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('Country') })
	@IsString({ message: isStringMessage('Country') })
	country: string;

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
	@IsNotEmpty({ message: isEmptyMessage('Job responsabilities') })
	@IsString({ message: isStringMessage('Job responsabilities') })
	responsabilities: string;

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Company division') })
	@IsExists(CompanyDivision)
	company_division: string;

	@Expose()
	@IsOptional()
	@IsNotEmpty({ message: isEmptyMessage('Job category') })
	@IsString({ message: isStringMessage('Job category') })
	@IsExists(JobCategory)
	category: string;

	@Expose()
	@IsOptional()
	@IsNotEmpty({ message: isEmptyMessage('Job type') })
	@IsEnum(JobTypes, { message: isEnumMessage('Job type', JobTypes) })
	job_type: JobTypes;

	@Expose()
	@IsOptional()
	@IsNotEmpty({ message: isEmptyMessage('Job duration') })
	@IsEnum(JobDuration, { message: isEnumMessage('Job duration', JobDuration) })
	duration: JobDuration;

	@Expose()
	@IsOptional()
	@IsNotEmpty({ message: isEmptyMessage('Job duration range') })
	@IsArray()
	duration_range: string[];

	@Expose()
	@IsOptional()
	@IsNotEmpty({ message: isEmptyMessage('Job salary type') })
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
	@IsString({ message: isStringMessage('Job currency') })
	@IsExists(Currency)
	currency: string;

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
	@ArrayNotEmpty({ message: isEmptyMessage('Work location') })
	@ValidateNested({ each: true })
	@Type(() => JobLocationDto)
	work_location: JobLocationDto[];

	@Expose()
	@IsOptional()
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
	skills: string[];

	@Expose()
	@IsOptional()
	requirements: string;

	@Expose()
	@IsOptional()
	questions: string[];
}
