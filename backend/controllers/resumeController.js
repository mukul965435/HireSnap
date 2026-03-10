import Resume from '../models/Resume.js';
import * as pdfService from '../services/pdfService.js';
import * as docxService from '../services/docxService.js';
import aiProvider from '../ai/aiProvider.js';
import { cosineSimilarity } from '../utils/similarity.js';

export const uploadResume = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        let rawText = '';
        if (req.file.mimetype === 'application/pdf') {
            rawText = await pdfService.parsePDF(req.file.buffer);
        } else {
            rawText = await docxService.parseDOCX(req.file.buffer);
        }

        // AI Analysis
        console.log('Sending text to AI. Text length:', rawText?.length);
        const parsedData = await aiProvider.analyzeResume(rawText);
        console.log('AI Analysis result received:', typeof parsedData);

        const resume = await Resume.create({
            user: req.user._id,
            fileName: req.file.originalname,
            rawText,
            parsedData,
            atsScore: parsedData.atsScore || 0
        });

        res.status(201).json({
            success: true,
            data: resume
        });
    } catch (error) {
        console.error('RESUME UPLOAD CONTROLLER ERROR:', error.message);
        next(error);
    }
};

export const getUserResumes = async (req, res, next) => {
    try {
        const resumes = await Resume.find({ user: req.user._id }).sort('-createdAt');
        res.status(200).json({
            success: true,
            data: resumes
        });
    } catch (error) {
        next(error);
    }
};

export const getResumeById = async (req, res, next) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }
        res.status(200).json({
            success: true,
            data: resume
        });
    } catch (error) {
        next(error);
    }
};

export const deleteResume = async (req, res, next) => {
    try {
        const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }
        res.status(200).json({ success: true, message: 'Resume deleted successfully' });
    } catch (error) {
        next(error);
    }
};

export const compareResumeToJob = async (req, res, next) => {
    try {
        const { resumeId, jobDescription } = req.body;
        if (!resumeId || !jobDescription) {
            return res.status(400).json({ success: false, message: 'Resume ID and Job Description are required' });
        }

        const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
        if (!resume) {
            return res.status(404).json({ success: false, message: 'Resume not found' });
        }

        // AI Comparison for keywords and suggestions (which includes rule-based scoring)
        const comparison = await aiProvider.compareToJob(resume.rawText, jobDescription);

        res.status(200).json({
            success: true,
            data: {
                ...comparison,
                // Fallback since the frontend UI might still look for semanticSimilarity
                semanticSimilarity: comparison.compatibilityScore
            }
        });
    } catch (error) {
        console.error('Job Matching Error:', error.message);
        next(error);
    }
};
