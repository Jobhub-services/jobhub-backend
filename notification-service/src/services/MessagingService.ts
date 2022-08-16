import express, { json, Express, Router } from 'express';
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
		this.app.use(json());
		this.app.use(`/notification`, this.router);
		this.app.listen(process.env.SERVICE_PORT, () => {
			console.log(`messaging service started. ${process.env.SERVICE_PORT}`);
		});
	}

	private _registerAppRoutes() {
		this.router.post('/reset-password', messagingController.sendResetPasswordEmail);
	}
}
