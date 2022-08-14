import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UserType } from '@/interfaces/users.interface';
import { isEmptyMessage, isStringMessage } from '@/config/dto.config';
import { Expose, Type } from 'class-transformer';
import { Match } from '@/helpers';

/*** login dtos */
export class LoginDto {
	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('Username') })
	@IsString({ message: isStringMessage('Username') })
	username: string;

	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('Password') })
	@IsString({ message: isStringMessage('Password') })
	password: string;
}

/*** register dtos */

class DeveloperInfoDto {
	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('First Name') })
	@IsString({ message: isStringMessage('First Name') })
	firstName: string;

	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('Last Name') })
	@IsString({ message: isStringMessage('Last Name') })
	lastName: string;
}

class CompanyInfoDto {
	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('Company name') })
	@IsString({ message: isStringMessage('Company name') })
	companyName: string;
}

export class RegisterDto {
	@Expose()
	@IsEmail()
	email: string;

	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('Username') })
	@IsString({ message: isStringMessage('Username') })
	username: string;

	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('Password') })
	@IsString({ message: isStringMessage('Password') })
	password: string;

	@Expose()
	@IsEnum(UserType)
	userType: string;

	@Expose()
	@IsOptional()
	@ValidateNested()
	@Type(() => DeveloperInfoDto)
	developerInfo?: DeveloperInfoDto;

	@Expose()
	@IsOptional()
	@ValidateNested()
	@Type(() => CompanyInfoDto)
	companyInfo?: CompanyInfoDto;
}

export class ResetPasswordDto {
	@Expose()
	email: string;

	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('Token') })
	@IsString({ message: isStringMessage('Token') })
	token: string;

	@Expose()
	@IsNotEmpty({ message: isEmptyMessage('Password') })
	@IsString({ message: isStringMessage('Password') })
	newPassword: string;

	@Expose()
	@Match('newPassword')
	confirmationPassword: string;
}
