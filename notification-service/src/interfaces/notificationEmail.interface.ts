import { Types } from 'mongoose';
export enum NotificationEmailPreference {
	NEWSLETTER = 'NEWSLETTER',
	JOB_SUGGESTIONS = 'JOB_SUGGESTIONS',
	NEW_MESSAGES = 'NEW_MESSAGES',
	NEW_APPLICATION = 'NEW_APPLICATION',
	DEVELOPER_SUGGESTIONS = 'DEVELOPER_SUGGESTIONS',
}

export type EmailPreference = {
	preferenceType: NotificationEmailPreference;
	isEnabled: boolean;
};

export interface INotificationEmail {
	userId?: Types.ObjectId;
	email: string;
	preferences: EmailPreference[];
}
