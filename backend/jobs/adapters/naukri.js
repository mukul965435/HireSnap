class NaukriAdapter {
    async fetchJobs(skills = [], location = 'India') {
        const mockNaukriJobs = [
            {
                id: 'nk-1',
                title: 'Javascript Architect',
                company: 'Global Solutions',
                location: 'Bangalore, India',
                type: 'Contract',
                skills: ['Javascript', 'Architecture', 'Team Lead', 'Node.js', 'React'],
                description: 'Lead our web architecture team for enterprise clients...',
                source: 'Naukri'
            },
            {
                id: 'nk-2',
                title: 'React Native Developer',
                company: 'AppWorks',
                location: 'Mumbai, India',
                type: 'Full-time',
                skills: ['React Native', 'JavaScript', 'Redux', 'iOS', 'Android'],
                description: 'Looking for an experienced mobile app developer.',
                source: 'Naukri'
            },
            {
                id: 'nk-3',
                title: 'Cloud DevOps Engineer',
                company: 'InnoTech Solutions',
                location: 'Pune, India',
                type: 'Full-time',
                skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins'],
                description: 'Manage and optimize our cloud infrastructure deployments.',
                source: 'Naukri'
            }
        ];
        
        await new Promise(resolve => setTimeout(resolve, 350));
        return mockNaukriJobs;
    }
}

export default new NaukriAdapter();
