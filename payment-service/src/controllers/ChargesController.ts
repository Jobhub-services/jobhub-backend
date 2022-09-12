import { createTransactionPostURL, decodeTransactionToken } from '@/helpers';
import { FeatureType } from '@/interfaces/subscriptions.interface';
import { TransactionTypes } from '@/interfaces/pTransaction.interface';
import PaymentTransaction from '@/models/PaymentTransaction';
import PaymentSubscription from '@/models/PaymentSubscription';
import { Request, Response } from 'express';
import { ChargePostDto } from '@/dtos/charges.dto';
import { ChargesStatus, IPCharge, ITapCharge } from '@/interfaces/pCharges.interface';
import { paymentService } from '@/services/PaymentService';
import PaymentCharge from '@/models/PaymentCharge';
import { CHARGE_POST_REDIRECT_URL } from '@/constants/payment.constants';
import PaymentMethod from '@/models/PaymentMethod';
import PaymentCustomer from '@/models/PaymentCustomer';
import Company from '@/models/Company';

class ChargesController {
	chargeTransaction = async (req: Request, res: Response) => {
		try {
			let transaction_token: any = req.query.transaction_token;
			const chargeData = req.body;
			if (transaction_token) {
				transaction_token = decodeTransactionToken(transaction_token);
				let referenceData: any = {};
				const transactionType = transaction_token.transactionType;
				if (transactionType === TransactionTypes.SUBSCRIPTION_PAYMENT) {
					const subscription_id = transaction_token.subscription_id;
					const subscription = await PaymentSubscription.findById(subscription_id);
					if (subscription.is_new_subscription) {
						subscription.creation_status = chargeData.status;
						subscription.is_new_subscription = false;
					} else {
						const features = [...subscription.features];
						features.forEach((feature) => {
							if (feature.slug === FeatureType.POSTING_NUMBER || (feature.slug === FeatureType.CONTACTS_NUMBER && feature.total_value >= 0))
								feature.current_value += feature.total_value;
						});
					}
					await subscription.save();
					referenceData.reference_id = subscription._id;
				} else if (transactionType === TransactionTypes.CHARGE_PAYMENT) {
					const { charge_id, quantity, userId } = transaction_token;
					const paymentCharge = await PaymentCharge.findById(charge_id);
					if (paymentCharge.status === ChargesStatus.INITIATED && chargeData.status === ChargesStatus.CAPTURED) {
						await this._chargeJobs(quantity, userId);
					}
					paymentCharge.status = chargeData.status;
					await paymentCharge.save();
					referenceData.reference_id = paymentCharge._id;
				}

				await PaymentTransaction.create({
					...referenceData,
					transactionType,
					charge_id: chargeData.id,
					status: chargeData.status,
					amount: chargeData.amount,
					currency: chargeData.currency,
					transaction: chargeData.transaction,
					description: chargeData.description,
					metadata: {
						destinations: chargeData.destinations,
						reference: chargeData.reference,
						currency: chargeData.currency,
						response: chargeData.response,
						card: chargeData.card,
						application: chargeData.application,
						merchant_payouts: chargeData.merchant_payouts,
						payout: chargeData.payout,
						activities: chargeData.activities,
					},
				});
			}
			res.status(200).send({ message: 'Transaction created' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	createPostCharge = async (req: Request, res: Response) => {
		try {
			const user = req.user;
			const subscription = await PaymentSubscription.findOne({ userId: user._id });
			if (!subscription) return res.status(406).send({ message: "You can't charge post without subscription" });
			const chargeBody: ChargePostDto = req.body;
			const paymentMethodId = chargeBody.paymentMethodId;
			const paymentMethodFilter: any = {};
			if (paymentMethodId) paymentMethodFilter._id = paymentMethodId;
			else paymentMethodFilter.default = true;
			const paymentMethod = await PaymentMethod.findOne({ userId: user._id, ...paymentMethodFilter });
			if (!paymentMethod) return res.status(406).send({ message: 'Please add payment method to charge post' });
			const userCustomer = await PaymentCustomer.findOne({ userId: user._id });
			const card_token = await paymentService.createCustomerCardToken(paymentMethod.card_id, userCustomer.customer_id);
			if (!card_token) return res.status(406).send({ message: "Can't process payment, please try again" });
			const company = (await Company.findOne({ userId: user._id })).toJSON();
			const postPrice = subscription.features.find((item) => item.slug == FeatureType.CHARGE_PER_POST).total_value;

			const paymentCharge = await PaymentCharge.create({
				userId: user._id,
				description: `Charge ${chargeBody.quantity} post`,
				quantity: chargeBody.quantity,
				amount: chargeBody.quantity * postPrice,
			});
			const tapCharge: ITapCharge = {
				amount: paymentCharge.amount,
				currency: company.currency.code,
				description: paymentCharge.description,
				save_card: false,
				receipt: {
					email: true,
				},
				customer: {
					id: userCustomer.customer_id,
					first_name: userCustomer.first_name,
					last_name: userCustomer.last_name,
					email: userCustomer.email,
					phone: {
						country_code: userCustomer.phone.country_code,
						number: userCustomer.phone.number,
					},
				},
				source: {
					id: card_token,
				},
				post: {
					url: createTransactionPostURL({
						transactionType: TransactionTypes.CHARGE_PAYMENT,
						charge_id: paymentCharge._id,
						quantity: chargeBody.quantity,
						userId: user._id,
					}),
				},
				redirect: {
					url: CHARGE_POST_REDIRECT_URL,
				},
			};
			const paymentChargeBody = await paymentService.createCharge(tapCharge);
			if (!paymentChargeBody) return res.status(406).send({ message: 'Failed to validate payment please try another valid card' });
			paymentCharge.transaction = paymentChargeBody.transaction;
			paymentCharge.status = paymentChargeBody.status;
			paymentCharge.charge_id = paymentChargeBody.charge_id;
			paymentCharge.metadata = paymentChargeBody.metadata;
			await paymentCharge.save();
			if (paymentChargeBody.status === ChargesStatus.INITIATED)
				return res.status(200).send({ paymentUrl: paymentCharge.transaction.url, message: 'Please complete the payment in the given url' });
			if (paymentChargeBody.status === ChargesStatus.CAPTURED) {
				await this._chargeJobs(chargeBody.quantity, user._id);
				return res.status(200).send({ message: 'Your post charged successfully ' });
			}
			res.status(406).send({ message: `Your payment is ${paymentCharge.status} please try later` });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	private async _chargeJobs(quantity: number, userId: any) {
		const subscription = await PaymentSubscription.findOne({ userId });
		const features = [...subscription.features];
		features.forEach((feature) => {
			if (feature.slug === FeatureType.POSTING_NUMBER) {
				feature.current_value += quantity;
				feature.total_value += quantity;
			}
		});
		subscription.features = features;
		await subscription.save();
	}
}

export default ChargesController;
