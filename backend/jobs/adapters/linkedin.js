class LinkedInAdapter {
    async fetchJobs(skills = [], location = 'Remote') {
        const mockLinkedInJobs = [
            {
                id: 'li-1',
                title: 'Senior Frontend Engineer',
                company: 'TechFlow',
                location: 'Remote',
                type: 'Full-time',
                skills: ['React', 'TypeScript', 'CSS', 'Figma', 'Next.js'],
                description: 'We are looking for a senior frontend engineer capable of building scalable UIs...',
                source: 'LinkedIn'
            },
            {
                id: 'li-2',
                title: 'Machine Learning Engineer',
                company: 'DeepMind',
                location: 'London, UK (Remote)',
                type: 'Full-time',
                skills: ['Python', 'TensorFlow', 'PyTorch', 'C++'],
                description: 'Join our research team to build cutting-edge foundation models...',
                source: 'LinkedIn'
            },
            {
                id: 'li-3',
                title: 'Backend Developer',
                company: 'FinTech Group',
                location: 'New York, NY',
                type: 'Full-time',
                skills: ['Java', 'Spring Boot', 'PostgreSQL', 'AWS'],
                description: 'Build robust financial engines handling millions of transactions.',
                source: 'LinkedIn'
            }
        ];
        
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        return mockLinkedInJobs;
    }
}

export default new LinkedInAdapter();
