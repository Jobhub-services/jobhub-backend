import { Router } from 'express';
import TalentJobController from '@/controllers/TalentJobController';
import { UserType } from '@/interfaces/users.interface';
import { authRole } from '@/middleware/auth.middleware';

const talentJobController = new TalentJobController();

const router = Router();

router.get('/', talentJobController.getPublicJobs);

export { router as publicJobRouter };
