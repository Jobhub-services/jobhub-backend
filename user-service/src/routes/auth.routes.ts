import { Router } from 'express';
import AuthController from '@/controllers/AuthController';
import validationMiddleware from '@/middleware/validation.middleware';
import { LoginDto, RegisterDto } from '@/dtos/auth.dto';

const authController = new AuthController();

const router = Router();

router.post('/login', validationMiddleware(LoginDto), authController.login);
router.post('/register', validationMiddleware(RegisterDto), authController.register);

export { router as authRouter };
