import { Router } from 'express';
import AuthController from '@/controllers/AuthController';
import validationMiddleware from '@/middleware/validation.middleware';
import { LoginDto, RegisterDto, ResetPasswordDto } from '@/dtos/auth.dto';

const authController = new AuthController();

const router = Router();

router.post('/login', validationMiddleware(LoginDto), authController.login);
router.post('/register', validationMiddleware(RegisterDto), authController.register);
router.post('/forget-password', authController.forgetPassword);
router.post('/reset-password', validationMiddleware(ResetPasswordDto), authController.resetPassword);

export { router as authRouter };
