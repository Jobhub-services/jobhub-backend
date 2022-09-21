import { Router } from 'express';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import validationMiddleware from '@/middleware/validation.middleware';
import TalentJobController from '@/controllers/TalentJobController';
import { CompanyJobDto } from '@/dtos/jobs.dto';

const talentJobController = new TalentJobController();

const router = Router();

router.get('/public',talentJobController.getPublicJobs)
router.use('/', authRole(UserType.DEVELOPER));
router.get('/', talentJobController.getJobs);
router.get('/:jobid', talentJobController.getJob);
router.put('/save', talentJobController.saveJob);

export { router as talentJobRouter };
