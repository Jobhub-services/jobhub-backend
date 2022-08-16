import { Router } from 'express';
import { previewRouter } from '@/routes/previews.routes';

const router = Router();
router.use('/preview', previewRouter);

router.get('/', (req, res) => {
	console.log('Notification service is up');
	return res.send('Notification service is up');
});

export default router;
