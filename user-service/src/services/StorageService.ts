import { Storage } from 'megajs';
import { STORAGE_API_PATH, STORAGE_PATH } from '@/constants/app.constants';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { tokenService } from './HashService';

class StorageService {
	appUrl = process.env.APP_URL;
	get storage() {
		return new Storage({
			email: 'zineddine@aimngt.com',
			password: '123456789zino',
		}).ready;
	}
	async moveFile(file: UploadedFile) {
		const fileName = `${authUser._id}_${uuidv4()}_${file.name}`;
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
	createFileURL = (fileName: string, expiresIn = 60 * 60 * 24) => {
		const appUrl = this.appUrl;
		const token = tokenService.hashToken({ fileName }, expiresIn);
		const fileURL = `${appUrl}${STORAGE_API_PATH}/${token}`;
		return fileURL;
	};
	readFileFromUrl = async (token: string) => {
		const payload = tokenService.verifyToken(token);
		const fileName = payload.fileName;
		const storage = await this.storage;
		const file = storage.root.children.find((item) => item.name === fileName);
		//@ts-ignore
		const data = await file.downloadBuffer();
		return [fileName, data];
		/*const filePath = path.resolve(__dirname, '..', '..', STORAGE_PATH, fileName);
		return filePath;*/
	};
}
export const storageService = new StorageService();
