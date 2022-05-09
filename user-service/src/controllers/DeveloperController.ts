import { Request, Response } from 'express';
import Developer from '@/models/Developer';
class DeveloperController {
	updateProfile = async (req: Request, res: Response) => {
		try {
			const rootObjectId = req.rootObjectId;
			const profile = await Developer.findOne({ userId: rootObjectId });
			res.status(200).send({ content: profile });
		} catch {
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}
export default DeveloperController;
