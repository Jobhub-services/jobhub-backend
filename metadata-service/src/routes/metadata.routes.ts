import { Router } from 'express';
import MetadataController from '@/controllers/MetadataController';

const metadataController = new MetadataController();

const router = Router();

router.put('/countries', metadataController.initCountries);
router.get('/countries', metadataController.getCountries);

router.put('/currencies', metadataController.initCurrencies);
router.get('/currencies', metadataController.getCurrencies);

router.put('/job-categories', metadataController.initCategories);
router.get('/job-categories', metadataController.getCategories);

router.put('/languages', metadataController.initLanguages);
router.get('/languages', metadataController.getLanguages);

export { router as metadataRouter };
