import { Router } from 'express';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import validationMiddleware from '@/middleware/validation.middleware';
import CompanyJobController from '@/controllers/CompanyJobController';
import { CompanyJobDto } from '@/dtos/jobs.dto';

const companyJobController = new CompanyJobController();

const router = Router();
router.use('/', authRole(UserType.COMPANY));
router.post('/', validationMiddleware(CompanyJobDto), companyJobController.createJob);
router.get('/', companyJobController.getJobs);
router.get('/edit/:jobid', companyJobController.editJob);
router.put('/:jobid', companyJobController.updateJob);
router.get('/:jobid', companyJobController.getJob);
router.delete('/:jobid', companyJobController.deleteJob);
router.patch('/restore/:jobid', companyJobController.restoreJob);

export { router as companyJobRouter };
