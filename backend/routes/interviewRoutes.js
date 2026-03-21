import express from 'express';
import * as interviewController from '../controllers/interviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/questions', protect, interviewController.getQuestions);

export default router;
