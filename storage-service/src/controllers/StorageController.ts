import { storageService } from '@/services/StorageService';
import * as mime from 'mime-types';
import { Request, Response } from 'express';

class StorageController {
	resolveFile = async (req: Request, res: Response) => {
		try {
			const fileToken = req.params.token;
			const fileInfo: {
				data: any;
				mimeType: any;
				fileName: any;
			} = await storageService.readFileFromUrl(fileToken);
			if (!fileInfo) res.status(404).send({ message: 'File not found' });
			res.setHeader('content-type', fileInfo.mimeType);
			res.setHeader('Content-Disposition', 'attachment;filename=' + fileInfo.fileName);
			res.send(fileInfo.data);
		} catch (e) {
			console.log(e);
			res.status(404).send({ message: 'File not found' });
		}
	};
}

export default StorageController;
