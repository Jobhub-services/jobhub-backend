import { Router } from 'express';
import { authRouter } from '@/routes/auth.routes';
import { userRouter } from '@/routes/user.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);

router.get('/', (req, res) => {
	console.log('User service is up');
	return res.send('User service is up');
});

export default router;
