import StorageController from '@/controllers/StorageController';
import { authStorage } from '@/middleware/auth.middleware';
import { Router } from 'express';
const router = Router();

const storageController = new StorageController();

router.use('/cdn/:fileid', authStorage);
router.get('/cdn/:fileid', storageController.resolveFile);

export default router;
