import FormData from 'form-data';
import { Types } from 'mongoose';
import { UploadedFile } from 'express-fileupload';
import HttpClient from '@/services/HttpClient';

class MessagingService {
	storageService: HttpClient;
	notificationService: HttpClient;
	paymentService: HttpClient;

	constructor() {
		const { STORAGE_SERVICE, NOTIFICATION_SERVICE, PAYMENT_SERVICE } = process.env;
		this.storageService = new HttpClient(STORAGE_SERVICE);
		this.notificationService = new HttpClient(NOTIFICATION_SERVICE);
		this.paymentService = new HttpClient(PAYMENT_SERVICE);
	}

	async excuteMessage(messageName: string, params: any[], req) {}

	createCompanyCutomer = async () => {
		try {
			const response = await this.paymentService.post('customers/customer');
			console.log(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	sendPasswordConfirmationEmail = async (payload: any) => {
		try {
			const response = await this.notificationService.post('reset-password', payload);
			console.log(response.data);
		} catch (e) {
			console.log(e);
		}
	};

	uploadUserMedia = async (userId: Types.ObjectId, file: UploadedFile) => {
		try {
			const data = this._buildFileFormData(userId, file);
			const response = await this.storageService.post('upload-user-media', data, {
				headers: {
					'content-type': 'multipart/form-data',
				},
			});
			if (response.data) {
				const { fileId } = response.data;
				return fileId;
			}
			return null;
		} catch (e) {
			console.log(e.data);
			return null;
		}
	};

	presigneUserMedia = async (fileIds: string | string[]) => {
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

	_buildFileFormData = (userId: Types.ObjectId, file: UploadedFile) => {
		const data = new FormData();
		data.append('user', String(userId));
		data.append('file', file.data);
		data.append('name', file.name);
		data.append('mimetype', file.mimetype);
		return data;
	};
}

const messagingService = new MessagingService();

export default messagingService;
