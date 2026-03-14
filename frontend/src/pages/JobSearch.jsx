import React, { useState, useEffect } from 'react';
import { Button, Card } from '../components/Common';
import { Search, Briefcase, MapPin, ExternalLink, DollarSign, Calendar, RefreshCw, Loader } from 'lucide-react';
import api from '../api/client';

const MatchBadge = ({ score }) => {
    const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#6b7280';
    const bg = score >= 70 ? 'rgba(16,185,129,0.1)' : score >= 40 ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)';
    return (
        <span style={{
            background: bg, color, padding: '0.25rem 0.6rem',
            borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700
        }}>
            {score}% Match
        </span>
    );
};

const JobSearch = () => {
    const [jobs, setJobs] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // fetchJobs accepts an explicit resumeId to avoid React closure stale-state bugs
    const fetchJobs = async (resumeId) => {
        // Use the passed resumeId if provided, otherwise fall back to current state
        const rid = resumeId !== undefined ? resumeId : selectedResume;
        setLoading(true);
        setError('');
        try {
            const url = `/jobs/recommendations${rid ? `?resumeId=${rid}` : ''}`;
            const res = await api.get(url);
            setJobs(res.data.data || []);
        } catch (err) {
            setError('Failed to load jobs. Please try again.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const res = await api.get('/resumes');
                const resumeList = res.data.data || [];
                setResumes(resumeList);

                // Auto-select first resume, then immediately fetch jobs WITH that resume
                const firstId = resumeList.length > 0 ? resumeList[0]._id : '';
                setSelectedResume(firstId);

                // Pass resumeId explicitly so closure captures the right value
                await fetchJobs(firstId);
            } catch (err) {
                console.error(err);
                // Still fetch jobs even if resume fetch failed
                await fetchJobs('');
            }
        };
        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <div>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Job Matches</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Live job recommendations powered by <strong style={{ color: 'var(--accent-color)' }}>Adzuna</strong>, personalized to your resume skills.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <select
                        value={selectedResume}
                        onChange={(e) => setSelectedResume(e.target.value)}
                        style={{ width: '220px' }}
                    >
                        <option value="">Default (No Filter)</option>
                        {resumes.map(r => (
                            <option key={r._id} value={r._id}>{r.fileName}</option>
                        ))}
                    </select>
                    <Button variant="secondary" onClick={() => fetchJobs(selectedResume)} disabled={loading}>
                        {loading ? <Loader size={16} className="spin" /> : <RefreshCw size={16} />}
                        {loading ? 'Loading...' : 'Refresh'}
                    </Button>
                </div>
            </div>

            {/* Stats bar */}
            {!loading && jobs.length > 0 && (
                <div style={{
                    display: 'flex', gap: '1.5rem', marginBottom: '2rem',
                    padding: '1rem 1.5rem', background: 'rgba(59,130,246,0.05)',
                    borderRadius: '12px', border: '1px solid rgba(59,130,246,0.1)',
                    flexWrap: 'wrap'
                }}>
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        <strong style={{ color: 'var(--text-primary)' }}>{jobs.length}</strong> live jobs found
                    </span>
                    {jobs[0]?.matchScore > 0 && (
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Top match: <strong style={{ color: '#10b981' }}>{jobs[0].matchScore}%</strong>
                        </span>
                    )}
                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>
                        Source: <strong style={{ color: 'var(--accent-color)' }}>Adzuna Live API</strong>
                    </span>
                </div>
            )}

            {/* Error */}
            {error && (
                <div style={{ padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: '12px', color: '#ef4444', marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            {/* Job Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <div className="spinner" style={{ margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--text-secondary)' }}>Fetching live jobs from Adzuna...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
                    {jobs.map((job, idx) => (
                        <Card key={job.id || idx} style={{ display: 'flex', flexDirection: 'column' }}>
                            {/* Title & Source */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ flex: 1, paddingRight: '0.5rem' }}>
                                    <h3 style={{ fontSize: '1.05rem', marginBottom: '0.25rem', lineHeight: 1.3 }}>{job.title}</h3>
                                    <p style={{ color: 'var(--accent-color)', fontWeight: 600, fontSize: '0.875rem' }}>{job.company}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
                                    <span style={{
                                        background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem',
                                        borderRadius: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)'
                                    }}>
                                        {job.source}
                                    </span>
                                    {job.matchScore !== undefined && <MatchBadge score={job.matchScore} />}
                                </div>
                            </div>

                            {/* Meta info */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    <MapPin size={14} /> {job.location}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                    <Briefcase size={14} /> {job.type}
                                </div>
                                {job.salary && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
                                        <DollarSign size={14} /> {job.salary}
                                    </div>
                                )}
                                {job.postedAt && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                        <Calendar size={14} /> Posted {job.postedAt}
                                    </div>
                                )}
                            </div>

                            {/* Description snippet */}
                            {job.description && (
                                <p style={{
                                    fontSize: '0.8rem', color: 'var(--text-secondary)',
                                    lineHeight: 1.5, marginBottom: '1rem',
                                    display: '-webkit-box', WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical', overflow: 'hidden'
                                }}>
                                    {job.description}
                                </p>
                            )}

                            {/* Skill Tags */}
                            {job.skills?.length > 0 && (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem', flex: 1 }}>
                                    {job.skills.map((skill, i) => (
                                        <span key={i} style={{
                                            padding: '0.2rem 0.6rem', borderRadius: '4px',
                                            background: 'rgba(59,130,246,0.1)', color: '#3b82f6', fontSize: '0.72rem'
                                        }}>
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Apply Button */}
                            <a
                                href={job.url || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ textDecoration: 'none', marginTop: 'auto' }}
                            >
                                <button style={{
                                    width: '100%', padding: '0.75rem', borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'transparent', color: 'var(--text-primary)',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem',
                                    fontWeight: 500, transition: 'all 0.2s',
                                }}
                                    onMouseOver={e => {
                                        e.currentTarget.style.background = 'rgba(59,130,246,0.1)';
                                        e.currentTarget.style.borderColor = 'rgba(59,130,246,0.4)';
                                    }}
                                    onMouseOut={e => {
                                        e.currentTarget.style.background = 'transparent';
                                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                    }}
                                >
                                    Apply Now <ExternalLink size={14} />
                                </button>
                            </a>
                        </Card>
                    ))}

                    {jobs.length === 0 && !loading && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                                No jobs found. Make sure your Adzuna API keys are set in <code>.env</code>.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default JobSearch;
