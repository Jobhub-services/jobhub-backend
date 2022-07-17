import { Router } from 'express';
import UserController from '@/controllers/UserController';

const userController = new UserController();

const router = Router();

router.get('/info', userController.userInfo);

export { router as userRouter };
