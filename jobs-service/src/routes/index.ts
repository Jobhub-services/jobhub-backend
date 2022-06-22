import { Router } from 'express';
import { companyJobRouter } from '@/routes/companyJob.routes';
import { talentJobRouter } from '@/routes/talentJob.routes';
import { auth } from '@/middleware/auth.middleware';

const router = Router();
router.use('/', auth);
router.use('/company', companyJobRouter);
router.use('/talent', talentJobRouter);

router.get('/', (req, res) => {
	console.log('Jobs service is up');
	return res.send('Jobs service is up');
});

export default router;
