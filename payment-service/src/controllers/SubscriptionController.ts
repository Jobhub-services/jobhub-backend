import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Subscription from '@/models/Subscription';
import { FeatureType, ISubscription } from '@/interfaces/subscriptions.interface';
import { IPSubscription, ITapSubscription, SubscriptionStatus, SubscriptionType } from '@/interfaces/pSubscriptions.interface';
import { ChargesStatus } from '@/interfaces/pCharges.interface';
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

	getMySubscription = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const subscription = await PaymentSubscription.findOne({ userId: user._id }).populate('subscriptionId');
			res.status(200).send({ content: subscription, isSubscribed: subscription != null });
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
			const paymentMethodFilter: any = {};
			if (paymentMethodId) paymentMethodFilter._id = paymentMethodId;
			else paymentMethodFilter.default = true;
			const paymentMethod = await PaymentMethod.findOne({ userId: user._id, ...paymentMethodFilter });
			if (!userCustomer || !paymentMethod) return res.status(406).send({ message: 'Payment method not allowed for this user' });
			const subscription = await Subscription.findById(subscriptionId);
			const paymentSubscription: IPSubscription = {
				userId: user._id,
				subscriptionId,
				payment_method: paymentMethodId,
				interval: subscriptionType,
				amount: subscriptionType === SubscriptionType.MONTHLY ? subscription.monthly_amount : subscription.yearly_amount * 12,
				auto_renew: true,
				description: `Company subscription to plan ${subscription.title} payed ${subscriptionType}`,
				features: subscription.features.map((feature) => {
					return { feature_id: feature._id, total_value: feature.value, current_value: feature.value, slug: feature.slug };
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
					auto_renew: paymentSubscription.auto_renew,
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
			const tapResponseSubscription = await paymentService.createSubscription(tapSubscription);
			if (tapResponseSubscription) {
				createdSubscription.subscription_id = tapResponseSubscription.subscription_id;
				createdSubscription.metadata = tapResponseSubscription.metadata;
				createdSubscription.creation_status = ChargesStatus.INITIATED;
				await createdSubscription.save();
			}

			res.status(200).send({ content: 'Subscription created' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	cancelSubscription = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const subscription = await PaymentSubscription.findOne({ userId: user._id });
			if (!subscription || !subscription?.subscription_id) return res.status(406).send({ content: 'You have no subscription registred yet' });
			const isCanceled = await paymentService.cancelSubscription(subscription?.subscription_id);
			if (!isCanceled) return res.status(406).send({ content: "We can't cancel your subscription now please try later or contact support" });
			await subscription.remove();
			res.status(200).send({ content: 'Your subscription canceled successfully' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	mockSubscription = async (req: Request, res: Response) => {
		try {
			const { userId, subscriptionId, interval } = req.body;
			if (!userId || !subscriptionId) {
				return res.status(400).send({ message: 'userId and subscriptionId are required' });
			}
			const subscription = await Subscription.findById(subscriptionId);
			if (!subscription) return res.status(404).send({ message: 'Subscription plan not found' });

			const subscriptionType = interval === SubscriptionType.YEARLY ? SubscriptionType.YEARLY : SubscriptionType.MONTHLY;
			const amount = subscriptionType === SubscriptionType.YEARLY ? subscription.yearly_amount * 12 : subscription.monthly_amount;

			await PaymentSubscription.deleteOne({ userId: new Types.ObjectId(userId) });

			const mockSub = await PaymentSubscription.create({
				userId: new Types.ObjectId(userId),
				subscriptionId: subscription._id,
				interval: subscriptionType,
				amount,
				auto_renew: false,
				creation_status: ChargesStatus.CAPTURED,
				status: SubscriptionStatus.ACTIVE,
				description: `[MOCK] ${subscription.title} - ${subscriptionType}`,
				features: subscription.features.map((f) => ({
					feature_id: f._id,
					slug: f.slug,
					total_value: f.value,
					current_value: f.value,
				})),
				timezone: { code: 'UTC', name: 'Coordinated Universal Time', utc: '+00:00' },
				currency: { code: 'USD', name: 'US Dollar' },
			});

			res.status(200).send({ message: 'Mock subscription created', _id: mockSub._id, plan: subscription.title, interval: subscriptionType });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	seedSubscriptions = async (_req: Request, res: Response) => {
		try {
			const plans = [
				{
					title: 'For One',
					description: 'Perfect for small companies just getting started with hiring.',
					monthly_amount: 49,
					yearly_amount: 39,
					features: [
						{ slug: FeatureType.POSTING_NUMBER, title: 'Job Postings', description: '5 active job postings', value: 5 },
						{ slug: FeatureType.POSTING_DURATION, title: 'Posting Duration', description: '30 days per posting', value: 30 },
						{ slug: FeatureType.CONTACTS_NUMBER, title: 'Contacts', description: 'Up to 50 candidate contacts', value: 50 },
					],
				},
				{
					title: 'Standard',
					description: 'For growing companies with regular hiring needs.',
					monthly_amount: 149,
					yearly_amount: 119,
					features: [
						{ slug: FeatureType.POSTING_NUMBER, title: 'Job Postings', description: '20 active job postings', value: 20 },
						{ slug: FeatureType.POSTING_DURATION, title: 'Posting Duration', description: '60 days per posting', value: 60 },
						{ slug: FeatureType.CONTACTS_NUMBER, title: 'Contacts', description: 'Up to 200 candidate contacts', value: 200 },
					],
				},
				{
					title: 'Infinity',
					description: 'Unlimited hiring power for large enterprises.',
					monthly_amount: 349,
					yearly_amount: 279,
					features: [
						{ slug: FeatureType.POSTING_NUMBER, title: 'Job Postings', description: 'Unlimited active job postings', value: 9999 },
						{ slug: FeatureType.POSTING_DURATION, title: 'Posting Duration', description: '90 days per posting', value: 90 },
						{ slug: FeatureType.CONTACTS_NUMBER, title: 'Contacts', description: 'Unlimited candidate contacts', value: 9999 },
					],
				},
			];

			const results = [];
			for (const plan of plans) {
				const existing = await Subscription.findOne({ title: plan.title });
				if (!existing) {
					const created = await Subscription.create(plan);
					results.push({ title: plan.title, status: 'created', _id: created._id });
				} else {
					results.push({ title: plan.title, status: 'already exists', _id: existing._id });
				}
			}
			res.status(200).send({ message: 'Seed complete', results });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	// ADMIN FUNCTIONS

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

	private _createSubscription = async (subscription: ISubscription) => {
		try {
			const subscriptions = await Subscription.create(subscription);
		} catch (e: any) {
			console.log(e);
		}
	};
}

export default SubscriptionController;
