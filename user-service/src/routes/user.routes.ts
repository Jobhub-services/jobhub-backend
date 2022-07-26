import { Router } from 'express';
import UserController from '@/controllers/UserController';

const userController = new UserController();

const router = Router();

router.get('/info', userController.userInfo);
router.put('/settings/security', userController.updateSecuritySettings);

export { router as userRouter };
