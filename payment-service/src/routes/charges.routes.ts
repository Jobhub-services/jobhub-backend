import { Router } from 'express';
import ChargesController from '@/controllers/ChargesController';

const chargesController = new ChargesController();
const router = Router();

export { router as chargesRouter };
