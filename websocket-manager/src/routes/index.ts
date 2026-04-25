import { Router } from 'express';
import { conversationRouter } from '@/routes/conversation.routes';
import { talentConversationRouter } from '@/routes/talentConversation.routes';
import { commonConversationRouter } from '@/routes/commonConversation.routes';

const router = Router();

router.use('/chat/message', commonConversationRouter);
router.use('/chat', conversationRouter);
router.use('/talent/chat', talentConversationRouter);

router.get('/', (req, res) => {
	console.log('Websocket service is up');
	return res.send('Websocket service is up');
});

export default router;
