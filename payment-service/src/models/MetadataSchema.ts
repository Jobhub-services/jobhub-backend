import { Types } from 'mongoose';
import { metadataSchema } from '@/helpers';

export const currencySchema = metadataSchema({
	_id: Types.ObjectId,
	code: String,
	name: String,
});
