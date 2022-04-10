import { Router } from 'express';
const router = Router();

router.get('/', (req, res) => {
	console.log('Jobs service is up');
	return res.send('Jobs service is up');
});

export default router;
