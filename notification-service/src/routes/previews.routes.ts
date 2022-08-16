import { Router } from 'express';
import { PreviewTemplateController } from '@/controllers/PreviewTemplateController';

const previewTemplateController = new PreviewTemplateController();

const router = Router();

router.get('/reset-password', previewTemplateController.previewResetPasswordTemplate);

export { router as previewRouter };
