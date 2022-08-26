import { Types } from 'mongoose';
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { isStringMessage, isEnumMessage, isEmptyMessage } from '@/config/dto.config';
import { Expose, Type } from 'class-transformer';
import { IsObjectId } from '@/helpers';

class MessageDto {
	@Expose()
	@IsString({ message: isStringMessage('Message content') })
	content: String;

	@Expose()
	@IsObjectId()
	sender: Types.ObjectId;
}
export class ConversationDto {
	@Expose()
	@IsArray()
	@ArrayNotEmpty()
	@IsObjectId({ each: true })
	members: Types.ObjectId[];

	@Expose()
	@IsOptional()
	@ValidateNested({ each: true })
	@Type(() => MessageDto)
	messages?: MessageDto[];
}
