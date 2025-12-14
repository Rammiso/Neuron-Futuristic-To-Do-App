import express from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { protect } from '../middlewares/auth.js';
import { validate, schemas } from '../middlewares/validation.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.route('/')
  .get(getSettings)
  .put(validate(schemas.updateSettings), updateSettings);

export default router;
