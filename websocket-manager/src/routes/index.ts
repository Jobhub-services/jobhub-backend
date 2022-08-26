import { Router } from 'express';
import { conversationRouter } from '@/routes/conversation.routes';

const router = Router();
router.use('/chat', conversationRouter);

router.get('/', (req, res) => {
	console.log('Websocket service is up');
	return res.send('Websocket service is up');
});

export default router;
