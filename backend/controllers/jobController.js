import jobProvider from '../jobs/jobProvider.js';
import Resume from '../models/Resume.js';

export const getRecommendedJobs = async (req, res, next) => {
    try {
        const { resumeId } = req.query;
        let filters = {};

        if (resumeId) {
            const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
            if (resume) {
                filters.skills = resume.parsedData.skills;
            }
        }

        const jobs = await jobProvider.fetchJobs(filters);

        res.status(200).json({
            success: true,
            data: jobs
        });
    } catch (error) {
        next(error);
    }
};
