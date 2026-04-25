import express, { json, Express, Router } from 'express';
import fileUpload from 'express-fileupload';
import messagingController from '@/controllers/MessagingController';

export default class MessagingService {
	app: Express;
	router: Router;
	constructor() {
		this.app = express();
		this.router = Router();
		this._registerAppRoutes();
		this._registerAppMiddleware();
	}

	private _registerAppMiddleware() {
		this.app.use(fileUpload({}));
		this.app.use(json());
		this.app.use(`/storage-sync`, this.router);
		this.app.listen(process.env.SERVICE_PORT, () => {
			console.log(`messaging service started. ${process.env.SERVICE_PORT}`);
		});
	}

	private _registerAppRoutes() {
		this.router.post('/upload-user-media', messagingController.uploadUserFile);
		this.router.post('/presigne-user-media', messagingController.presigneUserFile);
	}
}
