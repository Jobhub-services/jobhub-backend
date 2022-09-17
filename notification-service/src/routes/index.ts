import { Router } from 'express';
import { previewRouter } from '@/routes/previews.routes';
import { newsletterRouter } from '@/routes/newsletter.routes';
import { emailNotificationRouter } from '@/routes/emailNotification.routes';
import { userContactsRouter } from '@/routes/userContacts.routes';

const router = Router();

router.use('/preview', previewRouter);
router.use('/preferences', emailNotificationRouter);
router.use('/newsletter', newsletterRouter);
router.use('/', userContactsRouter);

router.get('/', (req, res) => {
	console.log('Notification service is up');
	return res.send('Notification service is up');
});

export default router;
