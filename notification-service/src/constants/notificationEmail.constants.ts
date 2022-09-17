import { NotificationEmailPreference } from '@/interfaces/notificationEmail.interface';

export const NOTIFICATION_PREFERENCES_KEYS = {
	[NotificationEmailPreference.DEVELOPER_SUGGESTIONS]: 'developerSuggestions',
	[NotificationEmailPreference.JOB_SUGGESTIONS]: 'jobSuggestions',
	[NotificationEmailPreference.NEWSLETTER]: 'subscribeToNewsletter',
	[NotificationEmailPreference.NEW_APPLICATION]: 'applicationsNews',
	[NotificationEmailPreference.NEW_MESSAGES]: 'messagesNews',
};
