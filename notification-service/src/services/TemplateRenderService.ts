import Handlebars from 'handlebars';
import path from 'path';
import fs from 'fs';

class TemplateRenderService {
	templatesPath = path.resolve(__dirname, '..', 'views');

	private _renderTemplate(template: string, data?: any) {
		const paths = template.split('.');
		const pathsSize = paths.length - 1;
		paths[pathsSize] = paths[pathsSize] + '.hbs';
		const templatePath = path.resolve(this.templatesPath, ...paths);
		if (!fs.existsSync(templatePath)) return '';
		const hbsContent = fs.readFileSync(templatePath, {
			encoding: 'utf8',
		});
		const hbsTemplateDelegate = Handlebars.compile(hbsContent);
		const content = hbsTemplateDelegate({ ...data, STAAK_ENV: process.env });
		return content;
	}

	renderTemplateWithLayout(payload: { template: string; data?: any; layout?: string }) {
		const { template, data, layout } = payload;
		let templateContent = this._renderTemplate(template, data);
		if (layout) {
			templateContent = this._renderTemplate(layout, {
				body: templateContent,
				...data,
			});
		}
		return templateContent;
	}
}

const templateRenderService = new TemplateRenderService();
export default templateRenderService;
