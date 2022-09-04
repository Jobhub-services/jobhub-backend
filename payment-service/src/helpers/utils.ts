import { Schema } from 'mongoose';
export function metadataSchema(schema: any) {
	return new Schema(schema, {
		_id: false,
	});
}
