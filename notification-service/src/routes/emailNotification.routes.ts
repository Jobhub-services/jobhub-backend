import { Router } from 'express';
import EmailNotificationController from '@/controllers/EmailNotificationController';
import messagingController from '@/controllers/MessagingController';

const emailNotificationController = new EmailNotificationController();

const router = Router();

router.put('/', emailNotificationController.updateUserPreferences);
router.get('/', emailNotificationController.getUserPreferences);
router.post('/application-email', messagingController.sendApplicationEmail);

export { router as emailNotificationRouter };
