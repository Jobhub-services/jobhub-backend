import { Storage } from 'megajs';
import { STORAGE_API_PATH } from '@/constants/app.constants';
import { v4 as uuidv4 } from 'uuid';
import { tokenService } from '@/services/HashService';
import UserMedia from '@/models/UserMedia';

class StorageService {
	appUrl = process.env.APP_URL;
	get storage() {
		return new Storage({
			email: 'zineddine@aimngt.com',
			password: '123456789zino',
		}).ready;
	}
	async moveFile(file, name) {
		const fileName = `${uuidv4()}_${name}`;
		const storage = await this.storage;
		await storage.upload(fileName, file.data).complete;
		return fileName;
		/*const extname = path.extname(file.name);
		const fileName = `${authUser._id}/${uuidv4()}${extname}`;
		const folderPath = path.resolve(__dirname, '../..', `${STORAGE_PATH}/${authUser._id}`);
		if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
		const filePath = path.resolve(__dirname, '../..', STORAGE_PATH, fileName);
		await file.mv(filePath);
		return fileName;*/
	}
	createFileURL = (fileId: string, expiresIn = 60 * 60 * 24) => {
		const appUrl = this.appUrl;
		//const token = tokenService.hashToken({ fileId }, expiresIn);
		const fileURL = `${appUrl}${STORAGE_API_PATH}/${fileId}`;
		return fileURL;
	};
	readFileFromUrl = async (fileId: string) => {
		try {
			/*const payload = tokenService.verifyToken(fileId);
			const fileId = payload.fileId;*/

			const storage = await this.storage;
			const media = await UserMedia.findById(fileId);

			const file = storage.root.children.find((item) => item.name === media.fileStorageKey);
			const data = await file?.downloadBuffer({});
			if (!data) return null;
			return {
				data,
				mimeType: media.mimeType,
				fileName: media.fileName,
			};
		} catch {
			return null;
		}
	};
}
export const storageService = new StorageService();
