import linkedinAdapter from './adapters/linkedin.js';
import naukriAdapter from './adapters/naukri.js';
import instahyreAdapter from './adapters/instahyre.js';

class JobProvider {
    constructor() {
        this.adapters = [
            linkedinAdapter,
            naukriAdapter,
            instahyreAdapter
        ];
    }

    async fetchJobs(filters = {}) {
        // Run all adapters concurrently
        const jobsArrays = await Promise.all(
            this.adapters.map(adapter => adapter.fetchJobs(filters.skills, filters.location))
        );

        // Flatten array of arrays
        let allJobs = jobsArrays.flat();

        // If no skills are provided, just return all jobs simulating a "Discover" feed
        if (!filters || !filters.skills || filters.skills.length === 0) {
            return allJobs.sort(() => Math.random() - 0.5); // Random shuffle for default view
        }

        const userSkillsLowercase = filters.skills.map(s => s.toLowerCase());

        // Standardize skill matching algorithm
        const scoredJobs = allJobs.map(job => {
            const jobSkillsLowercase = job.skills.map(s => s.toLowerCase());
            let matchCount = 0;

            // Simple intersection scoring
            for (const requiredSkill of jobSkillsLowercase) {
                // Check if user has this exact skill, or if there's a strong substring match
                const hasSkill = userSkillsLowercase.some(
                    userSkill => userSkill.includes(requiredSkill) || requiredSkill.includes(userSkill)
                );
                
                if (hasSkill) matchCount++;
            }

            // Calculate match percentage (0 to 100)
            const matchScore = job.skills.length > 0 
                ? Math.round((matchCount / job.skills.length) * 100) 
                : 0;

            return {
                ...job,
                matchScore
            };
        });

        // Filter out completely irrelevant jobs (e.g., jobs with 0 match if strict filtering is desired)
        // For a better UX in demos, we'll keep jobs with matchScore > 0
        const relevantJobs = scoredJobs.filter(job => job.matchScore > 0);

        // Sort by match score (highest first)
        relevantJobs.sort((a, b) => b.matchScore - a.matchScore);

        return relevantJobs;
    }
}

export default new JobProvider();
