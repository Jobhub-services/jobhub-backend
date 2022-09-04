import { Types } from 'mongoose';
import { metadataSchema } from '@/helpers';

export const countrySchema = metadataSchema({
	_id: Types.ObjectId,
	code: String,
	name: String,
});

export const jobRoleSchema = metadataSchema({
	_id: Types.ObjectId,
	name: String,
});
export const langSchema = metadataSchema({
	_id: Types.ObjectId,
	code: String,
	name: String,
});

export const skillSchema = metadataSchema({
	_id: Types.ObjectId,
	industry: String,
	name: String,
});

export const currencySchema = metadataSchema({
	_id: Types.ObjectId,
	code: String,
	name: String,
});

export const timezoneSchema = metadataSchema({
	_id: Types.ObjectId,
	code: String,
	name: String,
	utc: String,
});
