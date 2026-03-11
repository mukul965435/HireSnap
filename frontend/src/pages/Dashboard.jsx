import React, { useState, useEffect } from 'react';
import { Button, Card } from '../components/Common';
import { FileText, Briefcase, TrendingUp, CheckCircle } from 'lucide-react';
import api from '../api/client';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    RadialLinearScale
} from 'chart.js';
import { Line, Radar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    RadialLinearScale
);

const Dashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await api.get('/resumes');
                setResumes(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResumes();
    }, []);

    // Prepare dynamic data for the chart
    // Sort resumes from oldest to newest to show progression properly
    const sortedResumes = [...resumes].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    // Create labels (dates) and data points (scores)
    const labels = sortedResumes.length > 0 
        ? sortedResumes.map(r => new Date(r.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }))
        : ['No Data'];
        
    const dataPoints = sortedResumes.length > 0 
        ? sortedResumes.map(r => r.atsScore)
        : [0];

    const chartData = {
        labels,
        datasets: [
            {
                fill: true,
                label: 'ATS Score Progress',
                data: dataPoints,
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.4,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { grid: { display: false }, ticks: { color: '#666' } },
            x: { grid: { display: false }, ticks: { color: '#666' } },
        },
    };

    // --- SKILL GAP ANALYTICS (RADAR CHART) ---
    // Categorize latest skills into buckets
    const frontendSkills = ['react', 'javascript', 'typescript', 'html', 'css', 'next.js', 'vue', 'angular', 'bootstrap', 'tailwind'];
    const backendSkills = ['node.js', 'express', 'python', 'django', 'java', 'spring', 'c#', 'php', 'ruby', 'go'];
    const dbSkills = ['mongodb', 'postgresql', 'mysql', 'redis', 'sql', 'firebase', 'supabase', 'sqlite'];
    const devopsSkills = ['aws', 'docker', 'jenkins', 'kubernetes', 'azure', 'ci/cd', 'git', 'linux', 'gcp', 'terraform'];

    let scores = [0, 0, 0, 0]; // Frontend, Backend, Database, Cloud/DevOps
    
    if (sortedResumes.length > 0) {
        const latestSkills = sortedResumes[sortedResumes.length - 1].parsedData.skills.map(s => s.toLowerCase());
        latestSkills.forEach(skill => {
            if (frontendSkills.some(fs => skill.includes(fs))) scores[0] += 20;
            if (backendSkills.some(bs => skill.includes(bs))) scores[1] += 20;
            if (dbSkills.some(ds => skill.includes(ds))) scores[2] += 20;
            if (devopsSkills.some(ds => skill.includes(ds))) scores[3] += 20;
        });
    }

    // Cap at 100
    scores = scores.map(s => Math.min(s, 100));

    const radarData = {
        labels: ['Frontend', 'Backend', 'Database', 'Cloud & DevOps'],
        datasets: [
            {
                label: 'Your Stack',
                data: scores,
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: '#3b82f6',
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#3b82f6'
            },
            {
                label: 'Industry Average',
                data: [70, 75, 60, 65], // Mock industry standard
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                borderColor: '#10b981',
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#10b981'
            }
        ]
    };

    const radarOptions = {
        scales: {
            r: {
                angleLines: { color: 'rgba(255,255,255,0.1)' },
                grid: { color: 'rgba(255,255,255,0.1)' },
                pointLabels: { color: 'var(--text-secondary)', font: { size: 12 } },
                ticks: { display: false, min: 0, max: 100 }
            }
        },
        plugins: { legend: { labels: { color: 'var(--text-secondary)' } } }
    };


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome back!</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Here's what's happening with your job search.</p>
                </div>
                <Button onClick={() => window.location.href = '/upload'}>Upload Resume</Button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2.5rem'
            }}>
                {[
                    { label: 'Total Resumes', value: resumes.length, icon: FileText, color: '#3b82f6' },
                    { label: 'Avg. ATS Score', value: resumes.length ? Math.round(resumes.reduce((acc, curr) => acc + curr.atsScore, 0) / resumes.length) : 0, icon: TrendingUp, color: '#10b981' },
                    { label: 'Job Matches', value: '12', icon: Briefcase, color: '#f59e0b' },
                    { label: 'Optimized', value: resumes.length, icon: CheckCircle, color: '#8b5cf6' },
                ].map((stat, i) => (
                    <Card key={i}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{
                                background: `${stat.color}15`,
                                padding: '0.75rem',
                                borderRadius: '12px',
                                color: stat.color
                            }}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{stat.label}</p>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stat.value}</h3>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                <Card title="Score Improvement Trends" style={{ gridColumn: 'span 2' }}>
                    <div style={{ height: '300px' }}>
                        <Line data={chartData} options={options} />
                    </div>
                </Card>

                <Card title="Skill Gap Analytics" subtitle="You vs Industry Average" style={{ gridColumn: 'span 1' }}>
                    <div style={{ height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Radar data={radarData} options={radarOptions} />
                    </div>
                </Card>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
                <Card title="Recent Resumes" subtitle="Latest uploads">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {resumes.slice(0, 4).map((resume, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '0.75rem',
                                borderRadius: '10px',
                                background: 'rgba(255, 255, 255, 0.03)'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <FileText size={18} color="var(--text-secondary)" />
                                    <div>
                                        <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{resume.fileName}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{new Date(resume.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div style={{
                                    fontWeight: 700,
                                    color: resume.atsScore > 70 ? 'var(--success-color)' : 'var(--accent-color)',
                                    fontSize: '0.875rem'
                                }}>
                                    {resume.atsScore}%
                                </div>
                            </div>
                        ))}
                        {!loading && resumes.length === 0 && (
                            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>No resumes uploaded yet.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
