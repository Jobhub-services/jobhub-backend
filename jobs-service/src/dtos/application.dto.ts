import { Schema } from 'mongoose';
import { isEmptyMessage, isStringMessage } from '@/config/dto.config';
import { IsExists, IsObjectId } from '@/helpers';
import CompanyJob from '@/models/CompanyJob';
import JobQuestion from '@/models/JobQuestion';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class ResponseDto {
	@Expose()
	@IsExists(JobQuestion)
	question: Schema.Types.ObjectId;

	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('Response') })
	@IsString({ message: isStringMessage('Response') })
	response: string;
}

export class ApplicationDto {
	@Expose()
	@IsExists(CompanyJob)
	jobId: Schema.Types.ObjectId;

	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('Application motivation') })
	@IsString({ message: isStringMessage('Application motivation') })
	motivation: string;

	@Expose()
	@IsOptional()
	@IsArray()
	@ValidateNested({ each: true })
	@Type(() => ResponseDto)
	responses: ResponseDto[];

	@Expose()
	@IsOptional()
	@IsString()
	notice_period: string;

	@Expose()
	@IsOptional()
	@IsString()
	start_date: string;
}
