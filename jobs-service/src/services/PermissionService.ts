import PaymentSubscription from '@/models/PaymentSubscription';

enum FeatureType {
	POSTING_NUMBER = 'posting-number',
	POSTING_DURATION = 'posting-duration',
	CHARGE_PER_POST = 'charge-per-post',
	CONTACTS_NUMBER = 'contacts-number',
}

class PermissionService {
	async getSubscriptionJobInfo(userId: any): Promise<{ jobRemaining: number; jobDuration: number }> {
		try {
			const subscription: any = (await PaymentSubscription.findOne({ userId }))?.toJSON();
			if (!subscription) return null;
			const jobInfo = { jobRemaining: 0, jobDuration: 0 };
			subscription.features.forEach((feature) => {
				if (feature.slug === FeatureType.POSTING_NUMBER) jobInfo.jobRemaining = feature.current_value;
				if (feature.slug === FeatureType.POSTING_DURATION) jobInfo.jobDuration = feature.current_value;
			});
			return jobInfo;
		} catch (e) {
			console.log(e);
			return null;
		}
	}

	async subtractJobSubscription(userId: any, jobCreated = 1): Promise<void> {
		try {
			const subscription: any = await PaymentSubscription.findOne({ userId });
			const features = [...subscription.toJSON().features];
			features.forEach((feature) => {
				if (feature.slug === FeatureType.POSTING_NUMBER && feature.current_value > 0) feature.current_value -= jobCreated;
			});
			subscription.features = features;
			await subscription.save();
		} catch (e) {
			console.log(e);
		}
	}
}

export const permissionService = new PermissionService();
