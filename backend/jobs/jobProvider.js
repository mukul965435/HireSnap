class JobProvider {
    async fetchJobs(filters) {
        // Mocking external API calls to LinkedIn, Naukri, Instahyre
        // In a real scenario, this would call actual scrapers or APIs

        const mockJobs = [
            {
                id: '1',
                title: 'Senior Frontend Engineer',
                company: 'TechFlow',
                location: 'Remote',
                type: 'Full-time',
                skills: ['React', 'TypeScript', 'CSS', 'Figma'],
                description: 'We are looking for a senior frontend engineer...',
                source: 'LinkedIn'
            },
            {
                id: '2',
                title: 'Full Stack Developer',
                company: 'Innovate AI',
                location: 'New York, NY',
                type: 'Full-time',
                skills: ['Node.js', 'React', 'MongoDB', 'OpenAI'],
                description: 'Join our AI team to build the future of coding...',
                source: 'Instahyre'
            },
            {
                id: '3',
                title: 'Javascript Architect',
                company: 'Global Solutions',
                location: 'Bangalore, India',
                type: 'Contract',
                skills: ['Javascript', 'Architecture', 'Team Lead'],
                description: 'Lead our web architecture team...',
                source: 'Naukri'
            }
        ];

        // Simple skill-based filtering
        if (filters && filters.skills) {
            return mockJobs.filter(job =>
                job.skills.some(skill =>
                    filters.skills.some(userSkill =>
                        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                        skill.toLowerCase().includes(userSkill.toLowerCase())
                    )
                )
            );
        }

        return mockJobs;
    }
}

export default new JobProvider();
