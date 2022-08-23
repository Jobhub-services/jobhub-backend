import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
	console.log('Payment service is up');
	return res.send('Payment service is up');
});

export default router;
