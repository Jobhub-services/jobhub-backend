import { NOTIFICATION_PREFERENCES_KEYS } from '@/constants/notificationEmail.constants';
import { NotificationEmailPreference } from '@/interfaces/notificationEmail.interface';
import NotificationEmail from '@/models/NotificationEmail';
import { Request, Response } from 'express';

class EmailNotificationController {
	subscribeToNewsletter = async (req: Request, res: Response) => {
		try {
			const email = req.body.email;
			if (!email || (await NotificationEmail.exists({ email }))) return res.status(406).send({ message: 'Something went wrong please try again' });
			await NotificationEmail.create({
				email,
				preferences: [{ preferenceType: NotificationEmailPreference.NEWSLETTER, isEnabled: true }],
			});
			res.status(200).send({ message: 'User subscribed' });
		} catch (e) {
			res.status(500).send({ message: 'Something went wrong please try again' });
			console.log(e);
		}
	};

	updateUserPreferences = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const { subscribeToNewsletter, jobSuggestions, messagesNews, applicationsNews, developerSuggestions } = req.body;
			const preferences = [];

			if (subscribeToNewsletter) preferences.push({ preferenceType: NotificationEmailPreference.NEWSLETTER, isEnabled: true });
			else preferences.push({ preferenceType: NotificationEmailPreference.NEWSLETTER, isEnabled: false });

			if (jobSuggestions) preferences.push({ preferenceType: NotificationEmailPreference.JOB_SUGGESTIONS, isEnabled: true });
			else preferences.push({ preferenceType: NotificationEmailPreference.JOB_SUGGESTIONS, isEnabled: false });

			if (messagesNews) preferences.push({ preferenceType: NotificationEmailPreference.NEW_MESSAGES, isEnabled: true });
			else preferences.push({ preferenceType: NotificationEmailPreference.NEW_MESSAGES, isEnabled: false });

			if (applicationsNews) preferences.push({ preferenceType: NotificationEmailPreference.NEW_APPLICATION, isEnabled: true });
			else preferences.push({ preferenceType: NotificationEmailPreference.NEW_APPLICATION, isEnabled: false });

			if (developerSuggestions) preferences.push({ preferenceType: NotificationEmailPreference.DEVELOPER_SUGGESTIONS, isEnabled: true });
			else preferences.push({ preferenceType: NotificationEmailPreference.DEVELOPER_SUGGESTIONS, isEnabled: false });

			const notification = await NotificationEmail.findOneAndUpdate({ userId: user._id }, { preferences });
			if (!notification) await NotificationEmail.create({ preferences, userId: user._id, email: user.email });

			res.status(200).send({ message: 'Preferences updated' });
		} catch (e) {
			res.status(500).send({ message: 'Something went wrong please try again' });
			console.log(e);
		}
	};

	getUserPreferences = async (req: Request, res: Response) => {
		try {
			const userId = req.rootObjectId;
			const preferences = {
				subscribeToNewsletter: false,
				jobSuggestions: false,
				messagesNews: false,
				applicationsNews: false,
				developerSuggestions: false,
			};
			const notificationEmail = await NotificationEmail.findOne({ userId });
			if (notificationEmail) {
				notificationEmail.preferences.forEach((item) => {
					preferences[NOTIFICATION_PREFERENCES_KEYS[item.preferenceType]] = item.isEnabled;
				});
			}
			res.status(200).send({ content: preferences, status: 'ok' });
		} catch (e) {
			res.status(500).send({ message: 'Something went wrong please try again' });
			console.log(e);
		}
	};
}

export default EmailNotificationController;
