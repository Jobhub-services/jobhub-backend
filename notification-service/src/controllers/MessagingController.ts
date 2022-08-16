import { Request, Response } from 'express';
import templateRenderService from '@/services/TemplateRenderService';
import mailService from '@/services/MailService';

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
			mailService.sendAuthEmail(user.email, emailHTMLContent, subject);
			res.status(200).send({ message: 'Reset password email sent' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

const messagingController = new MessagingController();

export default messagingController;
