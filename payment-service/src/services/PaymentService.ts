import HttpClient from '@/services/HttpClient';
import { TAP_CLIENT_API_URL, TAP_CLIENT_API_KEY, TAB_API_PATHS } from '@/constants/payment.constants';
import { ITapCustomer, IPCustomer } from '@/interfaces/pCustomers.interface';
import { IPSubscription, ITapSubscription } from '@/interfaces/pSubscriptions.interface';
import { IPMethods } from '@/interfaces/pMethods.interface';
import { IPCharge, ITapCharge } from '@/interfaces/pCharges.interface';

const { SUBSCRIPTION_PATH, CUSTOMER_PATH, CHARGE_PATH, CARDS_PATH, TOKENS_PATH } = TAB_API_PATHS;

class PaymentService {
	private _tapClient: HttpClient;
	constructor() {
		this._tapClient = new HttpClient(TAP_CLIENT_API_URL, {
			authorization: `Bearer ${TAP_CLIENT_API_KEY}`,
			'content-type': 'application/json',
		});
	}

	// subscriptions methods
	async createSubscription(subscription: ITapSubscription): Promise<IPSubscription> {
		try {
			const subscriptionResponse = await this._tapClient.post(`${SUBSCRIPTION_PATH}`, subscription);
			if (subscriptionResponse.data) {
				const data = subscriptionResponse.data;
				return {
					subscription_id: data.id,
					metadata: {
						status: data.status,
					},
				};
			}
			return null;
		} catch (e) {
			console.log(e.response.data);
			return null;
		}
	}

	async cancelSubscription(subscriptionId: string): Promise<boolean> {
		try {
			const response = await this._tapClient.delete(`${SUBSCRIPTION_PATH}/${subscriptionId}`);
			console.log(response.data);
			return true;
		} catch (e) {
			console.log(e.response.data);
			return false;
		}
	}

	// charges methods
	async createCharge(charge: ITapCharge): Promise<IPCharge> {
		try {
			const chargeResponse = await this._tapClient.post(`${CHARGE_PATH}`, charge);
			if (chargeResponse.data) {
				const chargeData = chargeResponse.data;
				console.log(chargeData);
				return {
					transaction: chargeData.transaction,
					amount: chargeData.amount,
					description: chargeData.description,
					status: chargeData.status,
					charge_id: chargeData.id,
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
				};
			}
			return null;
		} catch (e) {
			console.log(e.response.data);
			return null;
		}
	}

	// customers methods
	async createCustomer(customer: ITapCustomer): Promise<IPCustomer> {
		try {
			const customerResponse = await this._tapClient.post(`${CUSTOMER_PATH}`, customer);
			if (customerResponse.data) {
				const data = customerResponse.data;
				return {
					customer_id: data.id,
					first_name: customer.first_name,
					last_name: customer.last_name,
					email: customer.email,
					phone: customer.phone,
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
			console.log(e.response.data);
			return null;
		}
	}

	async updateCustomer(customer_id: string, customer: ITapCustomer): Promise<void> {
		try {
			await this._tapClient.put(`${CUSTOMER_PATH}/${customer_id}`, customer);
		} catch (e) {
			console.log(e.response.data);
		}
	}

	async saveCustomerCard(customerId: string, cardToken: string): Promise<IPMethods> {
		try {
			const customerResponse = await this._tapClient.post(`${CARDS_PATH}/${customerId}`, { source: cardToken });
			if (customerResponse.data) {
				const data = customerResponse.data;
				console.log(data);
				return {
					card_id: data.id,
					name: data.name,
					last4: data.last_four,
					exp_year: data.exp_year,
					exp_month: data.exp_month,
					brand: data.brand,
				};
			}
			return null;
		} catch (e) {
			console.log(e.response.data);
			return null;
		}
	}

	async deleteCustomerCard(customerId: string, cardId: string): Promise<void> {
		try {
			await this._tapClient.delete(`${CARDS_PATH}/${customerId}/${cardId}`);
		} catch (e) {
			console.log(e.response.data);
		}
	}

	async createCustomerCardToken(card_id: string, customer_id: string): Promise<string> {
		try {
			const tokenResponse = await this._tapClient.post(`${TOKENS_PATH}`, {
				saved_card: {
					card_id,
					customer_id,
				},
			});
			if (tokenResponse.data) {
				const data = tokenResponse.data;
				return data.id;
			}
			return null;
		} catch (e) {
			console.log(e.response.data);
			return null;
		}
	}
}

export const paymentService = new PaymentService();
