import { Router } from 'express';
import TalentJobController from '@/controllers/TalentJobController';

const talentJobController = new TalentJobController();

const router = Router();

router.get('/', talentJobController.getPublicJobs);

export { router as publicJobRouter };
