import jobProvider from '../jobs/jobProvider.js';
import Resume from '../models/Resume.js';

export const getRecommendedJobs = async (req, res, next) => {
    try {
        const { resumeId } = req.query;
        let filters = {};

        if (resumeId) {
            const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
            if (resume) {
                filters.skills = resume.parsedData?.skills || [];
                console.log('[JobController] Resume:', resume.fileName);
                console.log('[JobController] Skills from resume:', JSON.stringify(filters.skills));
            } else {
                console.log('[JobController] Resume not found for id:', resumeId);
            }
        }

        const jobs = await jobProvider.fetchJobs(filters);

        // DEBUG: Log first 3 job scores
        jobs.slice(0, 3).forEach((j, i) => {
            console.log(`[Debug] Job ${i+1}: "${j.title}" | Score: ${j.matchScore}% | Skills: ${JSON.stringify(j.skills)}`);
        });

        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        next(error);
    }
};
