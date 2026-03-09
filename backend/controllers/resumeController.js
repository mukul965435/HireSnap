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
        const parsedData = await aiProvider.analyzeResume(rawText);

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

        // AI Comparison for keywords and suggestions
        const comparison = await aiProvider.compareToJob(resume.rawText, jobDescription);

        // Core Similarity scoring using embeddings
        const resumeEmbedding = await aiProvider.generateEmbeddings(resume.rawText);
        const jobEmbedding = await aiProvider.generateEmbeddings(jobDescription);

        const semanticSimilarity = cosineSimilarity(resumeEmbedding, jobEmbedding);

        res.status(200).json({
            success: true,
            data: {
                ...comparison,
                semanticSimilarity: Math.round(semanticSimilarity * 100)
            }
        });
    } catch (error) {
        next(error);
    }
};
