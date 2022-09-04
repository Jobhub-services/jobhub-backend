import { Router } from 'express';
import ChargesController from '@/controllers/ChargesController';

const chargesController = new ChargesController();
const router = Router();

router.post('/transaction/confirm', chargesController.chargeTransaction);

export { router as chargesRouter };
