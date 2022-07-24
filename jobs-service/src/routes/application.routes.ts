import { Router } from 'express';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import validationMiddleware from '@/middleware/validation.middleware';
import { ApplicationDto, InterviewDto } from '@/dtos/application.dto';
import ApplicationController from '@/controllers/ApplicationController';

const applicationController = new ApplicationController();

const router = Router();
router.post('/', authRole(UserType.DEVELOPER), validationMiddleware(ApplicationDto), applicationController.createApp);
router.put('/:applicationId', authRole(UserType.DEVELOPER), applicationController.updateApplication);
router.put('/status/:applicationId', authRole(UserType.COMPANY), applicationController.updateApplicationStatus);

router.get('/my', authRole(UserType.DEVELOPER), applicationController.getMyApplications);
router.get('/company', authRole(UserType.COMPANY), applicationController.getCompanyJobApplications);
router.get('/developer/:applicationId', authRole(UserType.DEVELOPER), applicationController.getApplicationForDeveloper);
router.get('/company/:applicationId', authRole(UserType.COMPANY), applicationController.getApplicationForCompany);

router.post('/:applicationId/interview', authRole(UserType.COMPANY), validationMiddleware(InterviewDto), applicationController.createInterview);
router.put(
	'/:applicationId/interview/:interviewId',
	authRole(UserType.COMPANY),
	validationMiddleware(InterviewDto),
	applicationController.updateInterview
);
router.delete('/:applicationId/interview/:interviewId', authRole(UserType.COMPANY), applicationController.deleteInterview);

export { router as applicationRouter };
