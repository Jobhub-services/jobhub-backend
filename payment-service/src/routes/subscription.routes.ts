import { Router } from 'express';
import SubscriptionController from '@/controllers/SubscriptionController';
import { authRole } from '@/middleware/auth.middleware';
import { UserType } from '@/interfaces/users.interface';
import validationMiddleware from '@/middleware/validation.middleware';
import { PaymentSubscriptionDto } from '@/dtos/subscription.dto';

const subscriptionController = new SubscriptionController();

const router = Router();

router.get('/', authRole(UserType.COMPANY), subscriptionController.getSubscriptions);
router.get('/me', authRole(UserType.COMPANY), subscriptionController.getMySubscription);
router.post('/subscribe', authRole(UserType.COMPANY), validationMiddleware(PaymentSubscriptionDto), subscriptionController.createPaymentSubscription);
router.delete('/cancel', authRole(UserType.COMPANY), subscriptionController.cancelSubscription);

router.post('/', authRole(UserType.ADMIN), subscriptionController.createSubscription);
router.put('/:subscriptionId', authRole(UserType.ADMIN), subscriptionController.updateSubscription);

export { router as subscriptionRouter };
