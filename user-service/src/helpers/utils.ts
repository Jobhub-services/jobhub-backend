import { model, Schema } from 'mongoose';
import satelize from 'satelize';
import { SoftDeleteModel, SoftDeleteDocument } from 'mongoose-delete';
export function softDeleteModel<T>(name, schema): SoftDeleteModel<T & SoftDeleteDocument> {
	const modal = model<T & SoftDeleteDocument>(name, schema) as any;
	return modal;
}

export function metadataSchema(schema: any) {
	return new Schema(schema, {
		_id: false,
	});
}

export function rendomString() {
	const randomString = (Math.random() + 1).toString(36).substring(7);
	return randomString;
}

export async function getGeolocationInfoFromIp(ip: string): Promise<any> {
	return new Promise((resolve) => {
		satelize.satelize({ ip }, function (err, payload) {
			resolve(payload);
		});
	});
}
