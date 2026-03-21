import express from 'express';
import multer from 'multer';
import * as resumeController from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' ||
            file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and DOCX files are allowed'), false);
        }
    }
});

router.post('/upload', protect, upload.single('resume'), resumeController.uploadResume);
router.get('/', protect, resumeController.getUserResumes);
router.get('/:id', protect, resumeController.getResumeById);
router.delete('/:id', protect, resumeController.deleteResume);
router.post('/compare', protect, resumeController.compareResumeToJob);
router.post('/generate-cover-letter', protect, resumeController.generateCoverLetter);

export default router;
