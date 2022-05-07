import CompanyDivision from '@/models/CompanyDivision';
import { Request, Response } from 'express';
class CompanyController {
	async createDivision(req: Request, res: Response) {
		try {
			const user = req.user;
			const division = await CompanyDivision.create({ name: req.body.name, company_id: user._id });
			res.status(200).send({ content: division });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
	async getDivision(req: Request, res: Response) {
		try {
			const user = req.user;
			const divisions = await CompanyDivision.find({ company_id: user._id });
			res.status(200).send({ content: divisions, size: divisions.length });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	}
}
export default CompanyController;
