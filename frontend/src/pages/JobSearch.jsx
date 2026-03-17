import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Briefcase, ExternalLink, RefreshCw, DollarSign, Calendar, Zap, Filter } from 'lucide-react';
import api from '../api/client';

const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } }
};

const cardVariant = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }
};

/* ─── Match badge ────────────────────────────────────────────── */
const MatchBadge = ({ score }) => {
    const data = score >= 70
        ? { cls: 'badge-success', label: `${score}% Match` }
        : score >= 40
        ? { cls: 'badge-warning', label: `${score}% Match` }
        : { cls: 'badge-neutral', label: `${score}% Match` };

    return <span className={`badge ${data.cls}`}>{data.label}</span>;
};

/* ─── Job Card ───────────────────────────────────────────────── */
const JobCard = ({ job, index }) => (
    <motion.div
        variants={cardVariant}
        whileHover={{ y: -4, boxShadow: '0 20px 56px rgba(0,0,0,0.1)' }}
        className="card"
        style={{ display: 'flex', flexDirection: 'column', padding: '1.75rem' }}
    >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem', gap: '0.75rem' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.01em', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {job.title}
                </h3>
                <p style={{ color: 'var(--accent-blue)', fontWeight: 600, fontSize: '0.85rem' }}>
                    {job.company}
                </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
                <span style={{
                    padding: '0.2rem 0.6rem', borderRadius: 99,
                    background: '#f5f5f5', color: 'var(--text-3)',
                    fontSize: '0.7rem', fontWeight: 600
                }}>{job.source}</span>
                {job.matchScore !== undefined && <MatchBadge score={job.matchScore} />}
            </div>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                <MapPin size={13} /> {job.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-2)' }}>
                <Briefcase size={13} /> {job.type}
            </span>
            {job.salary && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                    <DollarSign size={13} /> {job.salary}
                </span>
            )}
            {job.postedAt && (
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: 'var(--text-3)' }}>
                    <Calendar size={13} /> {job.postedAt}
                </span>
            )}
        </div>

        {/* Description */}
        {job.description && (
            <p style={{
                fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.6, marginBottom: '1rem',
                display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden'
            }}>
                {job.description}
            </p>
        )}

        {/* Skills */}
        {job.skills?.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem', flex: 1 }}>
                {job.skills.slice(0, 6).map((sk, i) => (
                    <span key={i} className="pill">{sk}</span>
                ))}
            </div>
        )}

        {/* CTA */}
        <motion.a
            href={job.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                padding: '0.7rem', borderRadius: 12,
                background: 'var(--text-1)', color: 'white',
                fontSize: '0.85rem', fontWeight: 600, textDecoration: 'none',
                marginTop: 'auto', transition: 'opacity 0.2s'
            }}
        >
            Apply Now <ExternalLink size={14} />
        </motion.a>
    </motion.div>
);

/* ─── JobSearch Page ─────────────────────────────────────────── */
const JobSearch = () => {
    const [jobs, setJobs] = useState([]);
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchJobs = async (resumeId) => {
        const rid = resumeId !== undefined ? resumeId : selectedResume;
        setLoading(true);
        setError('');
        try {
            const url = `/jobs/recommendations${rid ? `?resumeId=${rid}` : ''}`;
            const res = await api.get(url);
            setJobs(res.data.data || []);
        } catch {
            setError('Failed to load jobs. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            try {
                const res = await api.get('/resumes');
                const list = res.data.data || [];
                setResumes(list);
                const firstId = list.length > 0 ? list[0]._id : '';
                setSelectedResume(firstId);
                await fetchJobs(firstId);
            } catch {
                await fetchJobs('');
            }
        };
        init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
            >
                <div>
                    <p className="section-label"><Zap size={12} /> Live Jobs</p>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Job Matches</h1>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Personalized jobs powered by <strong style={{ color: 'var(--accent-blue)' }}>Adzuna</strong>, matched to your resume skills.
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ position: 'relative' }}>
                        <Filter size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-3)', pointerEvents: 'none' }} />
                        <select
                            value={selectedResume}
                            onChange={(e) => setSelectedResume(e.target.value)}
                            style={{ paddingLeft: 36, width: 220, borderRadius: 99, height: 40, fontSize: '0.85rem' }}
                        >
                            <option value="">All Jobs (No Filter)</option>
                            {resumes.map(r => <option key={r._id} value={r._id}>{r.fileName}</option>)}
                        </select>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="btn btn-primary"
                        onClick={() => fetchJobs(selectedResume)}
                        disabled={loading}
                        style={{ height: 40, fontSize: '0.875rem' }}
                    >
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                        {loading ? 'Loading...' : 'Refresh'}
                    </motion.button>
                </div>
            </motion.div>

            {/* Stats bar */}
            <AnimatePresence>
                {!loading && jobs.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        style={{
                            display: 'flex', gap: '1.5rem', marginBottom: '1.5rem',
                            padding: '0.9rem 1.25rem', background: 'var(--surface)',
                            borderRadius: 14, border: '1px solid var(--border)',
                            box_shadow: 'var(--shadow-sm)', flexWrap: 'wrap', alignItems: 'center'
                        }}
                    >
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>
                            <strong style={{ color: 'var(--text-1)' }}>{jobs.length}</strong> live jobs found
                        </span>
                        {jobs[0]?.matchScore > 0 && (
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-2)' }}>
                                Top match: <strong style={{ color: '#16a34a' }}>{jobs[0].matchScore}%</strong>
                            </span>
                        )}
                        <span className="badge badge-info" style={{ marginLeft: 'auto' }}>
                            Adzuna Live API
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Error */}
            {error && (
                <div style={{ padding: '1rem 1.25rem', background: '#fee2e2', borderRadius: 12, color: '#dc2626', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    {error}
                </div>
            )}

            {/* Grid */}
            {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem 0', gap: '1rem' }}>
                    <div className="spinner" />
                    <p style={{ color: 'var(--text-3)', fontSize: '0.875rem' }}>Fetching live jobs from Adzuna...</p>
                </div>
            ) : (
                <motion.div
                    variants={container} initial="hidden" animate="show"
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}
                >
                    {jobs.map((job, i) => <JobCard key={job.id || i} job={job} index={i} />)}
                    {jobs.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: 'var(--text-3)' }}>
                            <Search size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
                            <p>No jobs found. Check your Adzuna API keys in <code>.env</code>.</p>
                        </div>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default JobSearch;
