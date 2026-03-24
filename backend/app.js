import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import userRoutes from './routes/userRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(cors({
    origin: [
        /localhost:\d+$/,
        /vercel\.app$/, // Allow any Vercel deployment
        /netlify\.app$/, // Allow Netlify if used
        'https://hiresnap.onrender.com' // Self-link just in case
    ],
    credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Built-in Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/interview', interviewRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'up', timestamp: new Date() });
});

// Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err);
    let message = err.message || 'Internal Server Error';
    let statusCode = err.statusCode || 500;

    // Handle Zod Validation Errors
    if (err.name === 'ZodError') {
        statusCode = 400;
        message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join(', ');
    }

    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

export default app;
