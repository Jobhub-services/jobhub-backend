import { Request, Response } from 'express';
import { paymentService } from '@/services/PaymentService';
import { IUser } from '@/interfaces/users.interface';
import { IPCustomer, ITapCustomer } from '@/interfaces/pCustomers.interface';
import Company from '@/models/Company';
import PaymentCustomer from '@/models/PaymentCustomer';
import { BillingDto, PaymentMethodDto } from '@/dtos/customers.dto';
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
			const customer = await PaymentCustomer.findOne({ userId: user._id });
			if (!customer) return res.status(406).send({ message: "Can't update billing information please try again or contact support" });
			const customerBody: BillingDto = req.body;
			const tapCustomer: ITapCustomer = {};
			if (customerBody.first_name) {
				tapCustomer.first_name = customerBody.first_name;
				customer.first_name = customerBody.first_name;
			}
			if (customerBody.last_name) {
				tapCustomer.last_name = customerBody.last_name;
				customer.last_name = customerBody.last_name;
			}
			if (customerBody.email) {
				tapCustomer.email = customerBody.email;
				customer.email = customerBody.email;
			}
			if (customerBody.phone) {
				tapCustomer.phone = customerBody.phone;
				customer.phone = customerBody.phone;
			}
			if (customerBody.address) {
				customer.address = customerBody.address;
			}
			if (customerBody.city) {
				customer.city = customerBody.city;
			}
			if (customerBody.zipCode) {
				customer.zipCode = customerBody.zipCode;
			}
			if (customerBody.region) {
				customer.region = customerBody.region;
			}
			if (customerBody.country) {
				customer.country = customerBody.country;
			}

			await paymentService.updateCustomer(customer.customer_id, tapCustomer);
			await customer.save();
			res.status(200).send({ message: 'Billing information updated' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	getCustomer = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const customer = await PaymentCustomer.findOne({ userId: user._id });
			if (!customer) return res.status(406).send({ message: "Can't update billing information please try again or contact support" });
			res.status(200).send({ content: customer });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	createPaymentMethod = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const cardBody: PaymentMethodDto = req.body;
			const isExist = await PaymentMethod.exists({ card_id: cardBody.card_id });
			if (isExist) return res.status(500).send({ message: 'Payment method already exist' });
			await this._createCustomer(user);
			const userCustomer = await PaymentCustomer.findOne({ userId: user._id });
			const paymentMethod = await this._saveCardForCustomer(userCustomer.customer_id, cardBody.card_token);
			if (!paymentMethod) return res.status(406).send({ message: 'Not able to add card , please try again' });
			paymentMethod.userId = user._id;
			paymentMethod.card_token = cardBody.card_token;
			paymentMethod.default = true;
			const createdPaymentMethod = await PaymentMethod.create(paymentMethod);
			await PaymentMethod.updateMany(
				{ _id: { $ne: createdPaymentMethod._id } },
				{
					default: false,
				}
			);
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

	deletePaymentMethod = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const paymentMethodId = req.params.paymentMethodId;
			const customer = await PaymentCustomer.findOne({ userId: user._id });
			const paymentMethod = await PaymentMethod.findOneAndDelete({ userId: user._id, _id: paymentMethodId });
			if (paymentMethod && customer) {
				await paymentService.deleteCustomerCard(customer.customer_id, paymentMethod.card_id);
			}
			res.status(200).send({ content: 'Payment method deleted' });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	private _saveCardForCustomer = async (customerId: string, cardToken: string) => {
		const paymentMethod = await paymentService.saveCustomerCard(customerId, cardToken);
		return paymentMethod;
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
			title: company.companyName,
			description: `Staak company customer ${company.companyName}`,
			currency: company.currency?.code ?? 'USD',
		};
		const customer: IPCustomer = await paymentService.createCustomer(tapCustomer);
		customer.userId = user._id;
		customer.currency = company.currency;
		const paymentCustomer = await PaymentCustomer.create(customer);
		return { message: 'Payment customer attached to user', paymentCustomer };
	};
}

export default CustomerController;
