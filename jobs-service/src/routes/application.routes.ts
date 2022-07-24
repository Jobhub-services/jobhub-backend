import { Router } from 'express';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import validationMiddleware from '@/middleware/validation.middleware';
import { ApplicationDto } from '@/dtos/application.dto';
import ApplicationController from '@/controllers/ApplicationController';

const applicationController = new ApplicationController();

const router = Router();
router.post('/', authRole(UserType.DEVELOPER), validationMiddleware(ApplicationDto), applicationController.createApp);
router.put('/:applicationId', authRole(UserType.DEVELOPER), applicationController.updateApplication);
router.put('/status/:applicationId', authRole(UserType.COMPANY), applicationController.updateApplicationStatus);

router.get('/my', authRole(UserType.DEVELOPER), applicationController.getMyApplications);
router.get('/company', authRole(UserType.COMPANY), applicationController.getCompanyJobApplications);
router.get('/developer/:applicationId', applicationController.getApplicationForDeveloper);
router.get('/company/:applicationId', applicationController.getApplicationForCompany);

router.post('/:applicationId/interview', applicationController.createInterview);

export { router as applicationRouter };
