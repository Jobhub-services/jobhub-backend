import { Router } from 'express';
import { auth } from '@/middleware/auth.middleware';
import UserController from '@/controllers/UserController';

const userController = new UserController();

const router = Router();

router.use('/', auth);

router.get('/info', userController.userInfo);

export { router as userRouter };
