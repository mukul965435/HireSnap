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
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
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

    const chartData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                fill: true,
                label: 'ATS Score Progress',
                data: [65, 72, 68, 79, 85, 92],
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

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <Card title="Score Improvement Trends">
                    <div style={{ height: '300px' }}>
                        <Line data={chartData} options={options} />
                    </div>
                </Card>

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
