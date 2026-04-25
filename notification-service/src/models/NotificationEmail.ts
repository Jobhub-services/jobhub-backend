import { model, Schema, Document, Types } from 'mongoose';
import { INotificationEmail, NotificationEmailPreference } from '@/interfaces/notificationEmail.interface';
import User from '@/models/User';

const preferenceSchema = new Schema({
	preferenceType: {
		type: String,
		enum: NotificationEmailPreference,
	},
	isEnabled: Boolean,
});

const notificationEmailSchema: Schema = new Schema({
	userId: { type: Types.ObjectId, ref: User },
	email: String,
	preferences: [preferenceSchema],
});

const NotificationEmail = model<INotificationEmail & Document>('NotificationEmail', notificationEmailSchema);

export default NotificationEmail;
