import HttpClient from '@/services/HttpClient';

class MessagingService {
	storageService: HttpClient;
	paymentService: HttpClient;
	constructor() {
		const STORAGE_SERVICE = process.env.STORAGE_SERVICE;
		const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE;
		this.storageService = new HttpClient(STORAGE_SERVICE);
		this.paymentService = new HttpClient(PAYMENT_SERVICE);
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
}

const messagingService = new MessagingService();

export default messagingService;
