import { Router } from 'express';
import { auth, authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import DeveloperController from '@/controllers/DeveloperController';
import validationMiddleware from '@/middleware/validation.middleware';
import { DeveloperDto } from '@/dtos/developer.dto';

const developerController = new DeveloperController();

const router = Router();
router.use('/', auth);
router.use('/', (req, res, next) => authRole(req, res, next)(UserType.DEVELOPER));

router.put('/profile', validationMiddleware(DeveloperDto), developerController.updateProfile);

export { router as developerRouter };
