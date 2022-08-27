import CommonController from '@/controllers/CommonController';
import { Router } from 'express';

const commonController = new CommonController();
const router = Router();

router.get('/:chatId', commonController.getMessages);
router.put('/', commonController.addMessage);

export { router as commonConversationRouter };
