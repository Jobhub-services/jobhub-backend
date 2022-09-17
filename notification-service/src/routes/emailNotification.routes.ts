import { Router } from 'express';
import EmailNotificationController from '@/controllers/EmailNotificationController';

const emailNotificationController = new EmailNotificationController();

const router = Router();

router.put('/', emailNotificationController.updateUserPreferences);
router.get('/', emailNotificationController.getUserPreferences);

export { router as emailNotificationRouter };
