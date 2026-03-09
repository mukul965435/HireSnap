import React, { useState, useEffect } from 'react';
import { Button, Card } from '../components/Common';
import { Search, Briefcase, MapPin, ExternalLink, Filter } from 'lucide-react';
import api from '../api/client';

const JobSearch = () => {
    const [jobs, setJobs] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await api.get('/resumes');
                setResumes(res.data.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchResumes();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/jobs/recommendations${selectedResume ? `?resumeId=${selectedResume}` : ''}`);
            setJobs(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Job Matches</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Personalized job recommendations based on your technical profile.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Match using:</span>
                    <select
                        value={selectedResume}
                        onChange={(e) => setSelectedResume(e.target.value)}
                        style={{ width: '200px' }}
                    >
                        <option value="">Default (Global)</option>
                        {resumes.map(r => (
                            <option key={r._id} value={r._id}>{r.fileName}</option>
                        ))}
                    </select>
                    <Button variant="secondary" onClick={fetchJobs} disabled={loading}>
                        <Search size={18} /> Refresh
                    </Button>
                </div>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    {jobs.map((job) => (
                        <Card key={job.id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{job.title}</h3>
                                    <p style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.875rem' }}>{job.company}</p>
                                </div>
                                <span style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    color: 'var(--text-secondary)'
                                }}>{job.source}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <MapPin size={16} /> {job.location}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    <Briefcase size={16} /> {job.type}
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                {job.skills.map((skill, i) => (
                                    <span key={i} style={{
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '4px',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        color: '#3b82f6',
                                        fontSize: '0.75rem'
                                    }}>{skill}</span>
                                ))}
                            </div>

                            <Button variant="outline" style={{ width: '100%' }}>
                                View Details <ExternalLink size={14} />
                            </Button>
                        </Card>
                    ))}
                    {jobs.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>No jobs found matching your profile. Try updating your resume.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobSearch;
