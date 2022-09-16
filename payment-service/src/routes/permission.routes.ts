import { Router } from 'express';
import PermissionController from '@/controllers/PermissionController';

const permissionController = new PermissionController();
const router = Router();

export { router as permissionRouter };
