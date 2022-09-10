import { Router } from 'express';
import CustomerController from '@/controllers/CustomerController';
import validationMiddleware from '@/middleware/validation.middleware';
import { BillingDto, PaymentMethodDto } from '@/dtos/customers.dto';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';

const customerController = new CustomerController();
const router = Router();

router.use('/', authRole(UserType.COMPANY));

router.post('/customer', customerController.createCustomer);
router.put('/billing', validationMiddleware(BillingDto), customerController.updateCustomer);
router.get('/billing', customerController.getCustomer);
router.post('/payment-method', validationMiddleware(PaymentMethodDto), customerController.createPaymentMethod);
router.delete('/payment-method/:paymentMethodId', customerController.deletePaymentMethod);
router.get('/payment-method', customerController.getPaymentMethods);

export { router as customerRouter };
