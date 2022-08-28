import { Router } from 'express';
import PromotionController from '@/controllers/PromotionController';

const promotionController = new PromotionController();
const router = Router();

export { router as promotionRouter };
