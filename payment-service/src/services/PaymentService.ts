import HttpClient from '@/services/HttpClient';
import { TAP_CLIENT_API_URL, TAP_CLIENT_API_KEY, TAB_API_PATHS } from '@/constants/payment.constants';
import { ITapCustomer, IPCustomer } from '@/interfaces/pCustomers.interface';

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
	async createCustomer(customer: ITapCustomer): Promise<IPCustomer> {
		try {
			const customerResponse = await this._tapClient.post(`${CUSTOMER_PATH}`, customer);
			if (customerResponse.data) {
				const data = customerResponse.data;
				return {
					customer_id: data.id,
					title: data.title,
					metadata: {
						...data.metadata,
						api_version: data.api_version,
						live_mode: data.live_mode,
						object: data.object,
						description: data.description,
					},
				};
			}
			return null;
		} catch (e) {
			console.log(e);
			return null;
		}
	}
}

export const paymentService = new PaymentService();
