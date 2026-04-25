import { FeatureType } from '@/interfaces/subscriptions.interface';
export function getSubscriptionFeatureMessage(feature: FeatureType, value: number): string {
	if (feature === FeatureType.POSTING_NUMBER && value >= 0) {
		return `You have ${value} Job post remaining`;
	}
	if (feature === FeatureType.CONTACTS_NUMBER && value >= 0) {
		return `You have ${value} Contact remaining`;
	}
	if (feature === FeatureType.POSTING_DURATION) {
		return `Your job posts will apear in our system for ${value} days`;
	}
	if (feature === FeatureType.CHARGE_PER_POST && value >= 0) {
		return `Your can charge new post by paying just ${value}$`;
	}
	return null;
}
