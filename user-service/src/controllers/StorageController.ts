import { storageService } from '@/services/StorageService';
import * as mime from 'mime-types';
import { Request, Response } from 'express';

class StorageController {
	resolveFile = async (req: Request, res: Response) => {
		try {
			const fileToken = req.params.token;
			const [fileName, fileData] = await storageService.readFileFromUrl(fileToken);
			const contentType = mime.lookup(fileName) as string;
			res.setHeader('content-type', contentType);
			res.send(fileData);
		} catch (e) {
			console.log(e);
			res.status(404).send({ message: 'File not found' });
		}
	};
}

export default StorageController;
