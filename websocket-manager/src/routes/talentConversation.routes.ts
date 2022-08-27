import { Router } from 'express';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import TalentConversationController from '@/controllers/TalentConversationController';
import validationMiddleware from '@/middleware/validation.middleware';

const conversationController = new TalentConversationController();

const router = Router();

router.use('/', authRole(UserType.DEVELOPER));

router.get('/', conversationController.getConversations);

export { router as talentConversationRouter };
