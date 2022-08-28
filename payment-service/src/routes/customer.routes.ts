import { Router } from 'express';
import CustomerController from '@/controllers/CustomerController';

const customerController = new CustomerController();
const router = Router();

export { router as customerRouter };
