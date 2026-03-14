import adzunaAdapter from './adapters/adzuna.js';
import linkedinAdapter from './adapters/linkedin.js';
import naukriAdapter from './adapters/naukri.js';
import instahyreAdapter from './adapters/instahyre.js';

class JobProvider {
    constructor() {
        this.primaryAdapter = adzunaAdapter;
        this.fallbackAdapters = [linkedinAdapter, naukriAdapter, instahyreAdapter];
    }

    async fetchJobs(filters = {}) {
        const skills = filters.skills || [];
        const location = filters.location || '';

        // 1. Try real Adzuna API first
        let jobs = await this.primaryAdapter.fetchJobs(skills, location);

        // 2. Fall back to mock data if Adzuna not configured or returns nothing
        if (jobs.length === 0) {
            console.info('[JobProvider] Using mock adapters as fallback.');
            const jobsArrays = await Promise.all(
                this.fallbackAdapters.map(adapter => adapter.fetchJobs(skills, location))
            );
            jobs = jobsArrays.flat();

            // Score mock jobs using same skill intersection method
            if (skills.length > 0) {
                const userSkillsLower = skills.map(s => s.toLowerCase());
                jobs = jobs.map(job => {
                    const jobSkillsLower = (job.skills || []).map(s => s.toLowerCase());
                    let matchCount = 0;
                    for (const js of jobSkillsLower) {
                        if (userSkillsLower.some(us => us.includes(js) || js.includes(us))) matchCount++;
                    }
                    const matchScore = jobSkillsLower.length > 0
                        ? Math.round((matchCount / jobSkillsLower.length) * 100)
                        : 0;
                    return { ...job, matchScore };
                });
            }
        }

        // 3. Shuffle if no skill filter (Discover mode)
        if (skills.length === 0) {
            return jobs.sort(() => Math.random() - 0.5);
        }

        // 4. Sort by match score descending — best matches first
        return jobs.sort((a, b) => b.matchScore - a.matchScore);
    }
}

export default new JobProvider();
