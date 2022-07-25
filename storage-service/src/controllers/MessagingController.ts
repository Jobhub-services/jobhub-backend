import UserMedia from '@/models/UserMedia';
import { storageService } from '@/services/StorageService';
import { Request, Response } from 'express';

class MessagingController {
	uploadUserFile = async (req: Request, res: Response) => {
		try {
			const body = req.body;
			const file = req.files?.file;
			if (!file) res.status(500).send({ message: 'File not found' });
			const fileKey = await storageService.moveFile(file);
			const avatar = await UserMedia.create({
				fileStorageKey: fileKey,
				fileName: body.name,
				mimeType: body.mimetype,
			});
			res.send({ fileId: avatar._id });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
	presigneUserFile = async (req: Request, res: Response) => {
		try {
			const { fileIds } = req.body || {};
			let fileUrls;
			if (Array.isArray(fileIds)) {
				fileUrls = {};
				fileIds.forEach((fileId) => {
					fileUrls[fileId] = storageService.createFileURL(fileId);
				});
			} else {
				fileUrls = fileIds ? storageService.createFileURL(fileIds) : null;
			}
			res.send({ fileUrls });
		} catch (e) {
			console.log(e);
			res.status(500).send({ message: 'Something went wrong please try again' });
		}
	};
}

const messagingController = new MessagingController();

export default messagingController;
