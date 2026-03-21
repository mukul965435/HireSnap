import aiProvider from '../ai/aiProvider.js';

export const getQuestions = async (req, res, next) => {
    try {
        const { resumeText } = req.body;
        
        if (!resumeText) {
            return res.status(400).json({ success: false, message: 'Resume text is required' });
        }

        const questions = await aiProvider.generateInterviewQuestions(resumeText);
        
        res.status(200).json({
            success: true,
            data: questions
        });
    } catch (error) {
        next(error);
    }
};
