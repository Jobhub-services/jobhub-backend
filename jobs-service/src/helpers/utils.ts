import { model, Types, Schema } from 'mongoose';
import { SoftDeleteModel, SoftDeleteDocument } from 'mongoose-delete';
export function softDeleteModel<T>(name, schema): SoftDeleteModel<T & SoftDeleteDocument> {
	const modal = model<T & SoftDeleteDocument>(name, schema) as any;
	return modal;
}

export function strToObjectId(id: string) {
	return new Types.ObjectId(id);
}

export function metadataSchema(schema: any) {
	return new Schema(schema, {
		_id: false,
	});
}
