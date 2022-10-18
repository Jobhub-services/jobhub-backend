import nodemailer, { Transporter } from 'nodemailer';
import { noReplyMailCredentials } from '@/config/mail.config';

class MailService {
	noReplyMailTransporter: Transporter;
	jobsAlertTransporter: Transporter;
	constructor() {
		this.noReplyMailTransporter = nodemailer.createTransport(noReplyMailCredentials);
		this.jobsAlertTransporter = nodemailer.createTransport(noReplyMailCredentials);
	}

	private _sendEmailWithNoReplyTransporter(payload: { subject: string; content: string; to: string[] }) {
		const { subject, content, to } = payload;
		return this.noReplyMailTransporter.sendMail({
			from: '"Staak" <no-reply@staak.com>',
			to: to.join(','),
			subject,
			html: content,
		});
		//console.log('Email send to user');
	}

	sendAuthEmail(to: string, content: string, subject: string) {
		this._sendEmailWithNoReplyTransporter({
			content,
			subject,
			to: [to],
		});
	}
}

const mailService = new MailService();

export default mailService;
