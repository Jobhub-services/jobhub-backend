import { model } from 'mongoose';
import { SoftDeleteModel, SoftDeleteDocument } from 'mongoose-delete';
export function softDeleteModel<T>(name, schema): SoftDeleteModel<T & SoftDeleteDocument> {
	const modal = model<T>(name, schema) as any;
	return modal;
}
