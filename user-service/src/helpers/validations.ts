import { registerDecorator, ValidationOptions, ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';
import { Types, Model, Document } from 'mongoose';
const { ObjectId } = Types;

export function isValidObjectId(id) {
	if (ObjectId.isValid(id)) {
		if (String(new ObjectId(id)) === id) return true;
		return false;
	}
	return false;
}

export function IsObjectId(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			name: 'IsObjectId',
			target: object.constructor,
			propertyName: propertyName,
			options: { message: 'Text must be valid ID', ...validationOptions },
			validator: {
				validate(id: any) {
					return isValidObjectId(id);
				},
			},
		});
	};
}

const idFieldName = '_id';

@ValidatorConstraint({ async: true })
export class IsExistsConstraint implements ValidatorConstraintInterface {
	validate(value: any, args: ValidationArguments) {
		const [modal, fieldName] = args.constraints;
		if (fieldName === idFieldName && !isValidObjectId(value)) return false;
		return modal.findOne({ [fieldName]: value }).then((result) => {
			if (result) return true;
			return false;
		});
	}
}

export function IsExists(modal: Model<Document>, validationOptions?: ValidationOptions, fieldName = idFieldName) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: { message: "Item doesn't exists please select valid item", ...validationOptions },
			constraints: [modal, fieldName],
			validator: IsExistsConstraint,
		});
	};
}

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
	validate(value: any, args: ValidationArguments) {
		const [modal, fieldName] = args.constraints;
		if (fieldName === idFieldName && !isValidObjectId(value)) return false;
		return modal.findOne({ [fieldName]: value }).then((result) => {
			if (!result) return true;
			return false;
		});
	}
}

export function IsUnique(modal: Model<Document>, validationOptions?: ValidationOptions, fieldName = idFieldName) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target: object.constructor,
			propertyName: propertyName,
			options: { message: propertyName + ' already exists please select valid item', ...validationOptions },
			constraints: [modal, fieldName],
			validator: IsUniqueConstraint,
		});
	};
}
