import HttpClient from '@/services/HttpClient';

class MessagingService {
	storageService: HttpClient;
	constructor() {
		const STORAGE_SERVICE = process.env.STORAGE_SERVICE;
		this.storageService = new HttpClient(STORAGE_SERVICE);
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
