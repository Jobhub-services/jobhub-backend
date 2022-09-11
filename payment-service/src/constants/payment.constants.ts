export const TAP_CLIENT_API_URL = 'https://api.tap.company/v2/';
export const TAP_CLIENT_API_KEY = process.env.SECURE_PAYMENT_KEY;
export const TAP_CLIENT_PUBLIC_KEY = process.env.PUBLIC_PAYMENT_KEY;
export const CHARGE_POST_REDIRECT_URL = `${process.env.CLIENT_APP_URL}/payments/charge-post`;

export const TAB_API_PATHS = {
	SUBSCRIPTION_PATH: 'subscription/v1/',
	CUSTOMER_PATH: 'customers/',
	CHARGE_PATH: 'charges/',
	CARDS_PATH: 'card/',
};
