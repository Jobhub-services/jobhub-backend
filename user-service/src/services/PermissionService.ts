import Conversation from '@/models/Conversation';
import PaymentSubscription from '@/models/PaymentSubscription';

enum FeatureType {
	POSTING_NUMBER = 'posting-number',
	POSTING_DURATION = 'posting-duration',
	CHARGE_PER_POST = 'charge-per-post',
	CONTACTS_NUMBER = 'contacts-number',
}

class PermissionService {
	async checkUsersConnection(companyId: any, developerId: any): Promise<boolean> {
		try {
			const conversation = await Conversation.findOne({ members: { $all: [companyId, developerId] } });
			if (conversation) return true;
			const subscription: any = (await PaymentSubscription.findOne({ userId: companyId }))?.toJSON();
			if (!subscription) return false;
			let contacts = false;
			for (const feature of subscription.features) {
				if (feature.slug === FeatureType.CONTACTS_NUMBER) {
					if (feature.current_value !== 0) contacts = true;
					break;
				}
			}
			return contacts;
		} catch (e) {
			console.log(e);
			return false;
		}
	}

	async checkJobCreationStatus(userId: any): Promise<number> {
		try {
			const subscription: any = (await PaymentSubscription.findOne({ userId }))?.toJSON();
			if (!subscription) return 0;
			let jobCreationStatus = 0;
			for (const feature of subscription.features) {
				if (feature.slug === FeatureType.POSTING_NUMBER) {
					jobCreationStatus = feature.current_value;
					break;
				}
			}
			return jobCreationStatus;
		} catch (e) {
			console.log(e);
			return 0;
		}
	}
}

export const permissionService = new PermissionService();
