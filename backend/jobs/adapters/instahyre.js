class InstahyreAdapter {
    async fetchJobs(skills = [], location = '') {
        const mockInstahyreJobs = [
            {
                id: 'in-1',
                title: 'Full Stack Developer',
                company: 'Innovate AI',
                location: 'Remote',
                type: 'Full-time',
                skills: ['Node.js', 'React', 'MongoDB', 'Express', 'Tailwind'],
                description: 'Join our AI team to build the future of coding tools...',
                source: 'Instahyre'
            },
            {
                id: 'in-2',
                title: 'Data Engineer',
                company: 'DataStream',
                location: 'Delhi, India',
                type: 'Full-time',
                skills: ['Python', 'SQL', 'Snowflake', 'Airflow', 'Spark'],
                description: 'Design and build massive big data pipelines for real-time analytics.',
                source: 'Instahyre'
            },
            {
                id: 'in-3',
                title: 'Software Development Engineer II',
                company: 'Unicorn Startup',
                location: 'Bangalore, India',
                type: 'Full-time',
                skills: ['C++', 'Java', 'Data Structures', 'Algorithms', 'System Design'],
                description: 'Work on core services handling high throughput with low latency.',
                source: 'Instahyre'
            }
        ];
        
        await new Promise(resolve => setTimeout(resolve, 250));
        return mockInstahyreJobs;
    }
}

export default new InstahyreAdapter();
