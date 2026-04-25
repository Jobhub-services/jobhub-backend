import { Router } from 'express';
import SkillsController from '@/controllers/SkillsController';

const skillsController = new SkillsController();

const router = Router();

router.put('/', skillsController.initSkills);
router.get('/', skillsController.getSkills);

export { router as skillsRouter };
