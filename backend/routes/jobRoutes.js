import express from 'express';
import * as jobController from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/recommendations', protect, jobController.getRecommendedJobs);

export default router;
