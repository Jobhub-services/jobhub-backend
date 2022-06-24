import { Router } from 'express';
import { authRole, auth } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import validationMiddleware from '@/middleware/validation.middleware';
import { ApplicationDto } from '@/dtos/application.dto';
import ApplicationController from '@/controllers/ApplicationController';

const applicationController = new ApplicationController()

const router = Router();
router.use('/', (req, res, next) => authRole(req, res, next)(UserType.DEVELOPER));
router.post('/', validationMiddleware(ApplicationDto), applicationController.createApp);
router.get('/', applicationController.getApplications);

export { router as applicationRouter };