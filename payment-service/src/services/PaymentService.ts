import HttpClient from '@/services/HttpClient';
import { TAP_CLIENT_API_URL, TAP_CLIENT_API_KEY, TAB_API_PATHS } from '@/constants/payment.constants';
const { SUBSCRIPTION_PATH, CUSTOMER_PATH, CHARGE_PATH } = TAB_API_PATHS;

class PaymentService {
	private _tapClient: HttpClient;
	constructor() {
		this._tapClient = new HttpClient(TAP_CLIENT_API_URL, {
			authorization: `Bearer ${TAP_CLIENT_API_KEY}`,
			'content-type': 'application/json',
		});
	}

	// subscriptions methods
	createSubscription() {}

	// charges methods
	createCharge() {}

	// customers methods
	createCustomer() {}
}

export const paymentService = new PaymentService();
