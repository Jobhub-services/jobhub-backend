import { STORAGE_API_PATH, STORAGE_PATH } from '@/constants/app.constants';
import { UploadedFile } from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { tokenService } from './HashService';
class StorageService {
	appUrl = process.env.APP_URL;
	async moveFile(file: UploadedFile) {
		const extname = path.extname(file.name);
		const fileName = `${authUser._id}/${uuidv4()}${extname}`;
		const folderPath = path.resolve(__dirname, '../..', `${STORAGE_PATH}/${authUser._id}`);
		if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
		const filePath = path.resolve(__dirname, '../..', STORAGE_PATH, fileName);
		await file.mv(filePath);
		return fileName;
	}
	createFileURL = (fileName: string, expiresIn = 60 * 60 * 24) => {
		const appUrl = this.appUrl;
		const token = tokenService.hashToken({ fileName }, expiresIn);
		const fileURL = `${appUrl}${STORAGE_API_PATH}/${token}`;
		return fileURL;
	};
	readFileFromUrl = (token: string) => {
		const payload = tokenService.verifyToken(token);
		const fileName = `${STORAGE_PATH}/${payload.fileName}`;
		const filePath = path.resolve(__dirname, '..', '..', fileName);
		return filePath;
	};
}
export const storageService = new StorageService();
