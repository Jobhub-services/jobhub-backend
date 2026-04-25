import { Router } from 'express';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import CompanyController from '@/controllers/CompanyController';
import validationMiddleware from '@/middleware/validation.middleware';
import { UpdateCompanyDto } from '@/dtos/company.dto';

const companyController = new CompanyController();

const router = Router();

router.use('/', authRole(UserType.COMPANY));

router.get('/division', companyController.getDivision);

router.get('/profile', companyController.getProfile);
router.put('/profile', companyController.updateProfile);

router.get('/talents', companyController.getTalents);
router.get('/talents/:talentId', companyController.getTalentDetails);

router.put('/settings/account', validationMiddleware(UpdateCompanyDto), companyController.updateAccountSettings);

export { router as companyRouter };
