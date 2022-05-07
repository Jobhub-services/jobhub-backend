import { Router } from 'express';
import { metadataRouter } from '@/routes/metadata.routes';
import { skillsRouter } from '@/routes/skills.routes';
import { auth } from '@/middleware/auth.middleware';
const router = Router();
router.use('/', auth);
router.use('/skills', skillsRouter);
router.use('/', metadataRouter);
router.get('/', (req, res) => {
	console.log('Metadata service is up');
	return res.send('Metadata service is up');
});

export default router;
