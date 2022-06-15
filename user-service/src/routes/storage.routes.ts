import { Router } from 'express';
import StorageController from '@/controllers/StorageController';
import { authStorage } from '@/middleware/auth.middleware';

const storageController = new StorageController();

const router = Router();
router.use('/:token', authStorage);
router.get('/:token', storageController.resolveFile);

export { router as storageRouter };
