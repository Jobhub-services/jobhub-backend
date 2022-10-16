import { Request, Response } from 'express';
import templateRenderService from '@/services/TemplateRenderService';
import mailService from '@/services/MailService';
import NotificationEmail from '@/models/NotificationEmail';
import { IApplicationEmail, NotificationEmailPreference } from '@/interfaces/notificationEmail.interface';
import { jobSuggestionsService } from '@/services/JobSuggestionsService';

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
			//console.log(emailHTMLContent);
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

	sendJobAlertsToTalents = async (req: Request, res: Response) => {
		try {
			const emailJobs = await jobSuggestionsService.generateEmailJobs();
			res.status(200).send({ message: 'Notifications sent', emailJobs });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	sendApplicationEmail = async (req: Request, res: Response) => {
		try {
			const data: IApplicationEmail = req.body;
			if (!data.user_email || data.user_email === '') return res.status(406).send({ message: 'User email not provided' });
			const subject = 'Application has been submitted successfully';
			const payload = { title: subject, ...data };
			const htmlContent = templateRenderService.renderTemplateWithLayout({ template: 'emails.application', layout: 'emails.layout', data: payload });
			mailService.sendAuthEmail(data.user_email, htmlContent, subject);
			res.status(200).send({ message: 'Application email sent successfully' });
		} catch (e: any) {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

const messagingController = new MessagingController();

export default messagingController;
