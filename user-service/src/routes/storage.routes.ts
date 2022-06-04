import { Router } from 'express';
import { auth, authRole } from '@/middleware/auth.middleware';
import StorageController from '@/controllers/StorageController';

const storageController = new StorageController();

const router = Router();
router.use('/', auth);

router.get('/:token', storageController.resolveFile);

export { router as storageRouter };
