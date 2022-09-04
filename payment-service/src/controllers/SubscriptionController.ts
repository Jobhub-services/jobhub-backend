import { Request, Response } from 'express';
import Subscription from '@/models/Subscription';
import { ISubscription } from '@/interfaces/subscriptions.interface';

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
			const subscriptionId = req.body.subscriptionId;
			const subscription = await Subscription.findById(subscriptionId);
			const ipInfos = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
			console.log(ipInfos);
			res.status(200).send({ content: ipInfos });
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
