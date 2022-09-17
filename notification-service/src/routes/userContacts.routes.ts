import { Router } from 'express';
import UserContactsController from '@/controllers/UserContactsController';

const userContactsController = new UserContactsController();
const router = Router();

router.post('/contact-us', userContactsController.contactUS);

export { router as userContactsRouter };
