import { Router } from 'express';
import { chargesRouter } from '@/routes/charges.routes';
import { customerRouter } from '@/routes/customer.routes';
import { subscriptionRouter } from '@/routes/subscription.routes';
import { promotionRouter } from '@/routes/promotion.routes';

const router = Router();

router.use('/charges', chargesRouter);
router.use('/customers', customerRouter);
router.use('/subscriptions', subscriptionRouter);
router.use('/promotions', promotionRouter);

router.get('/', (req, res) => {
	console.log('Payment service is up');
	return res.send('Payment service is up');
});

export default router;
