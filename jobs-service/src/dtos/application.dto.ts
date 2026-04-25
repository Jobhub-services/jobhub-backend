import { Types } from 'mongoose';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested, IsEnum } from 'class-validator';
import { isEmptyMessage, isStringMessage, isEnumMessage } from '@/config/dto.config';
import { IsExists, IsObjectId } from '@/helpers';
import CompanyJob from '@/models/CompanyJob';

import { InterviewStatus } from '@/interfaces/application.interface';

class ResponseDto {
	@Expose()
	@IsObjectId()
	question: Types.ObjectId;

	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('Response') })
	@IsString({ message: isStringMessage('Response') })
	response: string;
}

export class ApplicationDto {
	@Expose()
	@IsExists(CompanyJob)
	jobId: Types.ObjectId;

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

export class InterviewDto {
	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Title') })
	title: string;

	@Expose()
	@IsOptional()
	startDate: string;

	@Expose()
	@IsOptional()
	endDate: string;

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Note') })
	note: string;

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Link') })
	link: string;

	@Expose()
	@IsOptional()
	@IsString({ message: isStringMessage('Location') })
	location: string;

	@Expose()
	@IsOptional()
	@IsEnum(InterviewStatus, { message: isEnumMessage('Status', InterviewStatus) })
	status: InterviewStatus;
}
