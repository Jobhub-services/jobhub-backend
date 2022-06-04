import { storageService } from '@/services/StorageService';
import { Request, Response } from 'express';

class StorageController {
	resolveFile = async (req: Request, res: Response) => {
		try {
			const fileToken = req.params.token;
			const filePath = storageService.readFileFromUrl(fileToken);
			res.download(filePath);
		} catch (e) {
			res.status(404).send({ message: 'File not found' });
		}
	};
}

export default StorageController;
