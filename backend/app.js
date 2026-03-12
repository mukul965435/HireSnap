import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/authRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import jobRoutes from './routes/jobRoutes.js';

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors({
    origin: [/localhost:\d+$/], // Allow any port on localhost
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/jobs', jobRoutes);

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
