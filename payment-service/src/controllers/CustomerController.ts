import { Request, Response } from 'express';
import { paymentService } from '@/services/PaymentService';
import { IUser } from '@/interfaces/users.interface';
import { IPCustomer, ITapCustomer } from '@/interfaces/pCustomers.interface';
import Company from '@/models/Company';
import PaymentCustomer from '@/models/PaymentCustomer';
import { PaymentMethodDto } from '@/dtos/customers.dto';
import PaymentMethod from '@/models/PaymentMethod';

class CustomerController {
	createCustomer = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const response = await this._createCustomer(user);
			res.status(200).send(response);
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	updateCustomer = async (req: Request, res: Response) => {
		try {
			const user = req.user;
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	createPaymentMethod = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const cardBody: PaymentMethodDto = req.body;
			const isExist = await PaymentMethod.exists({ card_id: cardBody.card_id, card_token: cardBody.card_token });
			if (isExist) return res.status(500).send({ message: 'Payment method already exist' });
			await this._createCustomer(user);
			const paymentMethod = await PaymentMethod.create({
				userId: user._id,
				...cardBody,
			});
			res.status(200).send({ message: 'Payment method added' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	getPaymentMethods = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const paymentMethods = await PaymentMethod.find({ userId: user._id });
			res.status(200).send({ content: paymentMethods });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	private _createCustomer = async (user: IUser) => {
		const isExist = await PaymentCustomer.exists({ userId: user._id });
		if (isExist) return { message: 'Payment customer already attached to user' };
		const company = (await Company.findOne({ userId: user._id })).toJSON();
		const tapCustomer: ITapCustomer = {
			first_name: company.companyName,
			last_name: company.companyName,
			email: user.email,
			phone: {
				...user.phone,
			},
			description: `Staak company customer ${company.companyName}`,
			currency: company.currency.code,
		};
		const customer: IPCustomer = await paymentService.createCustomer(tapCustomer);
		customer.userId = user._id;
		customer.currency = company.currency;
		const paymentCustomer = await PaymentCustomer.create(customer);
		return { message: 'Payment customer attached to user', paymentCustomer };
	};
}

export default CustomerController;
