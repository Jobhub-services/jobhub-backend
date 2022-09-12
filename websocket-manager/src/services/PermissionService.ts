import PaymentSubscription from '@/models/PaymentSubscription';

enum FeatureType {
	POSTING_NUMBER = 'posting-number',
	POSTING_DURATION = 'posting-duration',
	CHARGE_PER_POST = 'charge-per-post',
	CONTACTS_NUMBER = 'contacts-number',
}

class PermissionService {
	async getSubscriptionContactInfo(userId: any): Promise<number> {
		try {
			const subscription: any = (await PaymentSubscription.findOne({ userId }))?.toJSON();
			if (!subscription) return 0;
			let contacts = 0;
			for (const feature of subscription.features) {
				if (feature.slug === FeatureType.CONTACTS_NUMBER) {
					contacts = feature.current_value;
					break;
				}
			}
			return contacts;
		} catch (e) {
			console.log(e);
			return 0;
		}
	}
	async subtractContactsSubscription(userId: any, contactsCreated = 1): Promise<void> {
		try {
			const subscription: any = await PaymentSubscription.findOne({ userId });
			const features = [...subscription.toJSON().features];
			features.forEach((feature) => {
				if (feature.slug === FeatureType.CONTACTS_NUMBER && feature.current_value > 0) feature.current_value -= contactsCreated;
			});
			subscription.features = features;
			await subscription.save();
		} catch (e) {
			console.log(e);
		}
	}
}

export const permissionService = new PermissionService();
