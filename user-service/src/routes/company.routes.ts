import { Router } from 'express';
import { auth, authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import CompanyController from '@/controllers/CompanyController';

const companyController = new CompanyController();

const router = Router();

router.use('/', auth);
router.use('/', (req, res, next) => authRole(req, res, next)(UserType.COMPANY));

router.get('/division', companyController.getDivision);
router.post('/division', companyController.createDivision);

export { router as companyRouter };
