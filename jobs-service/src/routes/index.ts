import { Router } from 'express';
import { companyJobRouter } from '@/routes/companyJob.routes';
import { talentJobRouter } from '@/routes/talentJob.routes';
import { applicationRouter } from '@/routes/application.routes';
import { publicJobRouter } from '@/routes/publicJobs.routes';

const router = Router();
router.use('/company', companyJobRouter);
router.use('/talent', talentJobRouter);
router.use('/application', applicationRouter);
router.use('/public', publicJobRouter);

router.get('/', (req, res) => {
	console.log('Jobs service is up');
	return res.send('Jobs service is up');
});

export default router;
