import { Request, Response } from 'express';

class ChargesController {
	chargeTransaction = async (req: Request, res: Response) => {
		try {
			res.status(200).send({ message: 'Transaction created' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

export default ChargesController;
