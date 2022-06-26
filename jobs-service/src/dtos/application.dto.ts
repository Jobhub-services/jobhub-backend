import { Schema } from 'mongoose';
import { isEmptyMessage, isStringMessage } from "@/config/dto.config";
import { IsExists } from "@/helpers";
import CompanyJob from "@/models/CompanyJob";
import JobQuestion from "@/models/JobQuestion";
import { Expose, Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator";

class QuestionDto {
    @Expose()
    @IsNotEmpty({ message: isEmptyMessage('Question') })
    question: Schema.Types.ObjectId;

    @Expose()
    @IsNotEmpty({ message: isEmptyMessage('Response') })
    @IsString({ message: isStringMessage('Response') })
    response: string;
}

export class ApplicationDto {
    @Expose()
    @IsOptional()
    @IsNotEmpty({ message: isEmptyMessage('Job ID') })
    @IsString({ message: isStringMessage('Job ID') })
    jobId: Schema.Types.ObjectId;


    @Expose()
    @IsNotEmpty({ message: isEmptyMessage('Application resume') })
    @IsString({ message: isStringMessage('Application resume') })
    resume: string

    @Expose()
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => QuestionDto)
    questions: QuestionDto[]

    @Expose()
    @IsOptional()
    @IsString()
    notice_period: string

    @Expose()
    @IsOptional()
    @IsString()
    start_date: string
}