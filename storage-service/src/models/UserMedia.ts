import { model, Schema, Document } from 'mongoose';
import { IUserMedia } from '@/interfaces/userMedia.interfaces';

const userMediaSchema: Schema = new Schema(
	{
		fileName: String,
		mimeType: String,
		fileStorageKey: String,
	},
	{
		timestamps: true,
	}
);

const UserMedia = model<IUserMedia & Document>('UserMedia', userMediaSchema);

export default UserMedia;
