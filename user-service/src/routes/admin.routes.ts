import { Router } from 'express';
import AdminController from '@/controllers/AdminController';

const adminController = new AdminController();

const router = Router();

router.post('/create', adminController.createAdmin);

export { router as adminRouter };
