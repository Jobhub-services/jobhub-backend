import { decodeTransactionToken } from '@/helpers';
import { TransactionTypes } from '@/interfaces/pTransaction.interface';
import PaymentTransaction from '@/models/PaymentTransaction';
import PaymentSubscription from '@/models/PaymentSubscription';
import { Request, Response } from 'express';

class ChargesController {
	chargeTransaction = async (req: Request, res: Response) => {
		try {
			let transaction_token: any = req.query.transaction_token;
			const chargeData = req.body;
			if (transaction_token) {
				transaction_token = decodeTransactionToken(transaction_token);
				const transactionType = transaction_token.transactionType;
				if (transactionType === TransactionTypes.SUBSCRIPTION_PAYMENT) {
					const subscription_id = transaction_token.subscription_id;
					const subscription = await PaymentSubscription.findById(subscription_id);
					subscription.creation_status = chargeData.status;
					await subscription.save();
					await PaymentTransaction.create({
						reference_id: subscription._id,
						transactionType,
						charge_id: chargeData.id,
						status: chargeData.status,
						amount: chargeData.amount,
						currency: chargeData.currency,
						transaction: chargeData.transaction,
						description: chargeData.description,
						metadata: {
							destinations: chargeData.destinations,
							payout: chargeData.payout,
							merchant_payouts: chargeData.merchant_payouts,
						},
					});
				} else if (transactionType === TransactionTypes.CHARGE_PAYMENT) {
				}
			}
			res.status(200).send({ message: 'Transaction created' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};

	createPostCharge = async (req: Request, res: Response) => {
		try {
			res.status(200).send({ message: 'Post charge created' });
		} catch (e: any) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

export default ChargesController;
