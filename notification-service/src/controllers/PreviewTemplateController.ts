import { Request, Response } from 'express';
import templateRenderService from '@/services/TemplateRenderService';

export class PreviewTemplateController {
	previewResetPasswordTemplate = async (req: Request, res: Response) => {
		try {
			const templateContent = this._renderEmailTemplate('emails.reset-password', {
				fullName: 'Test name',
				resetLink: '/test-link',
			});
			res.status(200).send(templateContent);
		} catch (e) {
			res.status(500).send({ message: 'Something went wrong please try again' });
			console.log(e);
		}
	};

	private _renderEmailTemplate(template: string, data?: any) {
		return templateRenderService.renderTemplateWithLayout({
			template: template,
			layout: 'emails.layout',
			data,
		});
	}
}
