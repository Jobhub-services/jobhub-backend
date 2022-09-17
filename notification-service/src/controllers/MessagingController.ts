import { Request, Response } from 'express';
import templateRenderService from '@/services/TemplateRenderService';
import mailService from '@/services/MailService';
import NotificationEmail from '@/models/NotificationEmail';
import { NotificationEmailPreference } from '@/interfaces/notificationEmail.interface';

class MessagingController {
	sendResetPasswordEmail = async (req: Request, res: Response) => {
		try {
			const { token, user } = req.body;
			if (!token || !user) throw new Error('Email info not provided');
			const subject = 'Password Reset Request for Staak';
			const payload = { resetLink: `${process.env.CLIENT_APP_URL}/reset-password/${token}`, fullName: user.username, title: subject };
			const emailHTMLContent = templateRenderService.renderTemplateWithLayout({
				template: 'emails.reset-password',
				layout: 'emails.layout',
				data: payload,
			});
			console.log(emailHTMLContent);
			mailService.sendAuthEmail(user.email, emailHTMLContent, subject);
			res.status(200).send({ message: 'Reset password email sent' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	subscribeToNewsletter = async (req: Request, res: Response) => {
		try {
			const { user } = req.body;
			let emailNotification = await NotificationEmail.findOne({ email: user.email });
			if (emailNotification) {
				emailNotification.userId = user._id;
				await emailNotification.save();
			} else {
				await NotificationEmail.create({
					userId: user._id,
					email: user.email,
					preferences: [{ preferenceType: NotificationEmailPreference.NEWSLETTER, isEnabled: true }],
				});
			}
			res.status(200).send({ message: 'User subscribed' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

const messagingController = new MessagingController();

export default messagingController;
