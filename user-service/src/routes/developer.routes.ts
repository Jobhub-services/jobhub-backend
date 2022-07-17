import { Router } from 'express';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import DeveloperController from '@/controllers/DeveloperController';
import validationMiddleware from '@/middleware/validation.middleware';
import { DeveloperDto } from '@/dtos/developer.dto';
const developerController = new DeveloperController();
const router = Router();
router.use('/', authRole(UserType.DEVELOPER));

router.put('/profile', validationMiddleware(DeveloperDto), developerController.updateProfile);
router.get('/profile', validationMiddleware(DeveloperDto), developerController.getProfile);

export { router as developerRouter };
