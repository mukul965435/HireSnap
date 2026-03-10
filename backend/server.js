import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
    
    // Set server timeout to 10 minutes for slow AI processing
    server.timeout = 600000;
    server.keepAliveTimeout = 600000;
});
