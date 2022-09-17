import { Router } from 'express';
import EmailNotificationController from '@/controllers/EmailNotificationController';

const emailNotificationController = new EmailNotificationController();

const router = Router();

router.post('/subscribe', emailNotificationController.subscribeToNewsletter);

export { router as newsletterRouter };
