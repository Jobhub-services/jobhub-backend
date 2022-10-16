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

export interface IApplicationEmail {
	job_title: string;
	category: string;
	locations: {
		city?: string;
		country?: string;
	}[];
	company_link: string;
	company_logo: string;
	company_name: string;
	profile_link: string;
	application_link: string;
	jobs_link: string;
	user_email: string;
}
