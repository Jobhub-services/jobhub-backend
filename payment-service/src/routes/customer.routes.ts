import { Router } from 'express';
import CustomerController from '@/controllers/CustomerController';
import validationMiddleware from '@/middleware/validation.middleware';
import { PaymentMethodDto } from '@/dtos/customers.dto';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';

const customerController = new CustomerController();
const router = Router();

router.use('/', authRole(UserType.COMPANY));

router.post('/customer', customerController.createCustomer);
router.put('/customer', customerController.updateCustomer);
router.post('/payment-method', validationMiddleware(PaymentMethodDto), customerController.createPaymentMethod);
router.get('/payment-method', customerController.getPaymentMethods);

export { router as customerRouter };
