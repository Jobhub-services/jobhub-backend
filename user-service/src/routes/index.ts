import { Router } from 'express';
import { authRouter } from '@/routes/auth.routes';
import { userRouter } from '@/routes/user.routes';
import { companyRouter } from '@/routes/company.routes';
import { developerRouter } from '@/routes/developer.routes';
import { adminRouter } from '@/routes/admin.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/super-user', adminRouter);
router.use('/user', userRouter);
router.use('/company', companyRouter);
router.use('/developer', developerRouter);

router.get('/', (req, res) => {
	console.log('User service is up');
	return res.send('User service is up');
});

export default router;
