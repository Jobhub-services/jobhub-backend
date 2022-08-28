import { Router } from 'express';
import SubscriptionController from '@/controllers/SubscriptionController';

const subscriptionController = new SubscriptionController();
const router = Router();

export { router as subscriptionRouter };
