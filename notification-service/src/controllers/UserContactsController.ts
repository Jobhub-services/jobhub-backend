import UserContact from '@/models/UserContact';
import { Request, Response } from 'express';

class UserContactsController {
	contactUS = async (req: Request, res: Response) => {
		try {
			const { email, name, companyName, message } = req.body;
			if (!email) return res.status(406).send({ message: 'User email is required' });
			await UserContact.create({
				email,
				name,
				companyName,
				message,
			});
			res.status(200).send({ message: 'Contacted successfully' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

export default UserContactsController;
