import { Request, Response } from 'express';
import Subscription from '@/models/Subscription';
import { ISubscription } from '@/interfaces/subscriptions.interface';
import { IPSubscription, ITapSubscription, SubscriptionStatus, SubscriptionType } from '@/interfaces/pSubscriptions.interface';
import Company from '@/models/Company';
import PaymentCustomer from '@/models/PaymentCustomer';
import PaymentMethod from '@/models/PaymentMethod';
import { createTransactionPostURL, getCurrentDataWithFormat } from '@/helpers';
import { TransactionTypes } from '@/interfaces/pTransaction.interface';
import { paymentService } from '@/services/PaymentService';
import PaymentSubscription from '@/models/PaymentSubscription';

class SubscriptionController {
	getSubscriptions = async (req: Request, res: Response) => {
		try {
			const subscriptions = await Subscription.find();
			res.status(200).send({ content: subscriptions });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	createSubscription = async (req: Request, res: Response) => {
		try {
			const subscriptions = req.body.subscriptions;
			if (subscriptions) {
				if (Array.isArray(subscriptions)) {
					for (const subscription of subscriptions) {
						await this._createSubscription(subscription);
					}
				} else {
					await this._createSubscription(subscriptions);
				}
			}
			res.status(200).send({ message: 'Subscriptions created' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	updateSubscription = async (req: Request, res: Response) => {
		try {
			res.status(200).send({ message: 'Subscriptions created' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	createPaymentSubscription = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const { subscriptionId, paymentMethodId, subscriptionType } = req.body;
			const company = (await Company.findOne({ userId: user._id })).toJSON();
			if (!company.timezone) return res.status(406).send({ message: 'Please add timezone to your profile' });
			const userCustomer = await PaymentCustomer.findOne({ userId: user._id });
			const paymentMethod = await PaymentMethod.findOne({ userId: user._id, _id: paymentMethodId });
			if (!userCustomer || !paymentMethod) return res.status(406).send({ message: 'Payment method not allowed for this user' });
			const subscription = await Subscription.findById(subscriptionId);
			const paymentDate = new Date().toUTCString();
			const paymentSubscription: IPSubscription = {
				userId: user._id,
				subscriptionId,
				payment_method: paymentMethodId,
				interval: subscriptionType,
				amount: subscriptionType === SubscriptionType.MONTHLY ? subscription.monthly_amount : subscription.yearly_amount * 12,
				auto_renew: false,
				description: `Company subscription to plan ${subscription.title} payed ${subscriptionType}`,
				features: subscription.features.map((feature) => {
					return { feature_id: feature._id, total_value: feature.value, current_value: feature.value };
				}),
				timezone: company.timezone,
				currency: company.currency,
			};
			const createdSubscription = await PaymentSubscription.create(paymentSubscription);
			const tapSubscription: ITapSubscription = {
				term: {
					interval: subscriptionType,
					period: 1,
					from: getCurrentDataWithFormat('YYYY-MM-DDTHH:mm:ss', paymentSubscription.timezone.code),
					due: 0,
					auto_renew: false,
					timezone: paymentSubscription.timezone.code,
				},
				charge: {
					amount: paymentSubscription.amount,
					currency: paymentSubscription.currency.code,
					description: paymentSubscription.description,
					receipt: {
						email: true,
					},
					customer: {
						id: userCustomer.customer_id,
					},
					source: {
						id: paymentMethod.card_id,
					},
					post: {
						url: createTransactionPostURL({
							transactionType: TransactionTypes.SUBSCRIPTION_PAYMENT,
							subscription_id: createdSubscription._id,
						}),
					},
				},
			};
			console.log(tapSubscription);
			const tapResponseSubscription = await paymentService.createSubscription(tapSubscription);
			if (tapResponseSubscription) {
				createdSubscription.subscription_id = tapResponseSubscription.subscription_id;
				createdSubscription.metadata = tapResponseSubscription.metadata;
				createdSubscription.status = SubscriptionStatus.INITIATED;
				await createdSubscription.save();
			}

			res.status(200).send({ content: 'Subscription created' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	private _createSubscription = async (subscription: ISubscription) => {
		try {
			const subscriptions = await Subscription.create(subscription);
		} catch (e: any) {
			console.log(e);
		}
	};
}

export default SubscriptionController;
