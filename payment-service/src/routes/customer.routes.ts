import { Router } from 'express';
import CustomerController from '@/controllers/CustomerController';
import validationMiddleware from '@/middleware/validation.middleware';
import { BillingDto, PaymentMethodDto } from '@/dtos/customers.dto';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';

const customerController = new CustomerController();
const router = Router();

router.post('/customer', customerController.createCustomer);
router.put('/billing', authRole(UserType.COMPANY), validationMiddleware(BillingDto), customerController.updateCustomer);
router.get('/billing', authRole(UserType.COMPANY), customerController.getCustomer);
router.post('/payment-method', authRole(UserType.COMPANY), validationMiddleware(PaymentMethodDto), customerController.createPaymentMethod);
router.delete('/payment-method/:paymentMethodId', authRole(UserType.COMPANY), customerController.deletePaymentMethod);
router.get('/payment-method', authRole(UserType.COMPANY), customerController.getPaymentMethods);

export { router as customerRouter };
