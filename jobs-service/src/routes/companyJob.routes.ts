import { Router } from 'express';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import validationMiddleware from '@/middleware/validation.middleware';
import CompanyJobController from '@/controllers/CompanyJobController';
import { CompanyJobDto } from '@/dtos/jobs.dto';

const companyJobController = new CompanyJobController();

const router = Router();
router.use('/', (req, res, next) => authRole(req, res, next)(UserType.COMPANY));
router.post('/', validationMiddleware(CompanyJobDto), companyJobController.createJob);
router.get('/', companyJobController.getJobs);
router.put('/:jobid', companyJobController.updateJob);
router.get('/:jobid', companyJobController.getJob);
router.delete('/:jobid', companyJobController.deleteJob);

export { router as companyJobRouter };
