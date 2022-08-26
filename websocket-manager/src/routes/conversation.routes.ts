import { Router } from 'express';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import ConversationController from '@/controllers/ConversationController';
import validationMiddleware from '@/middleware/validation.middleware';
import { ConversationDto } from '@/dtos/conversation.dto';

const conversationController = new ConversationController();

const router = Router();

router.use('/', authRole(UserType.COMPANY));

router.get('/', conversationController.getConversations);
router.post('/', validationMiddleware(ConversationDto), conversationController.createConversation);
router.delete('/:chatId', conversationController.deleteConversation);
router.get('/message/:chatId', conversationController.getMessages);
router.put('/message', conversationController.addMessage);

export { router as conversationRouter };
