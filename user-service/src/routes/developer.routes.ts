import { Router } from 'express';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import DeveloperController from '@/controllers/DeveloperController';
import validationMiddleware from '@/middleware/validation.middleware';
import { DeveloperDto, UpdateDeveloperDto } from '@/dtos/developer.dto';
const developerController = new DeveloperController();
const router = Router();
router.use('/', authRole(UserType.DEVELOPER));

router.put('/profile', validationMiddleware(DeveloperDto), developerController.updateProfile);
router.get('/profile', validationMiddleware(DeveloperDto), developerController.getProfile);

router.get('/companies', developerController.getCompanies);
router.get('/companies/:companyId', developerController.getCompanyDetail);
router.put('/settings/account', validationMiddleware(UpdateDeveloperDto), developerController.updateAccountSettings);

export { router as developerRouter };
