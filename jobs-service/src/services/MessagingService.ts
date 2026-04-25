import { IApplicationEmail } from '@/interfaces/application.interface';
import HttpClient from '@/services/HttpClient';

class MessagingService {
	storageService: HttpClient;
	notificationService: HttpClient;
	notificationApp: HttpClient;
	paymentService: HttpClient;
	constructor() {
		const { STORAGE_SERVICE, NOTIFICATION_SERVICE, PAYMENT_SERVICE, NOTIFICATION_SERVICE_APP } = process.env;
		this.storageService = new HttpClient(STORAGE_SERVICE);
		this.notificationService = new HttpClient(NOTIFICATION_SERVICE);
		this.paymentService = new HttpClient(PAYMENT_SERVICE);
		this.notificationApp = new HttpClient(NOTIFICATION_SERVICE_APP);
	}

	presigneUserMedia = async (fileIds: any) => {
		if (!fileIds) return;
		try {
			const response = await this.storageService.post(
				'presigne-user-media',
				{ fileIds },
				{
					headers: {
						'Content-Type': 'application/json',
					},
				}
			);
			if (response.data) {
				const { fileUrls } = response.data;
				return fileUrls;
			}
			return null;
		} catch (e) {
			console.log(e.data);
			return null;
		}
	};

	triggerJobsAlert = async () => {
		try {
			this.notificationService.put('job-alerts');
			return null;
		} catch (e) {
			console.log(e.data);
			return null;
		}
	};
	applicationEmail = async (payload: IApplicationEmail, accessToken: string) => {
		try {
			this.notificationApp.setAuthToken(accessToken);
			const response = await this.notificationApp.post('preferences/application-email', payload);
			return null;
		} catch (e: any) {
			return null;
		}
	};
}

const messagingService = new MessagingService();

export default messagingService;
