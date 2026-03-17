import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Briefcase, TrendingUp, Zap, ArrowUpRight, CheckCircle2, Clock, Star, ChevronRight } from 'lucide-react';
import api from '../api/client';
import {
    Chart as ChartJS, CategoryScale, LinearScale, PointElement,
    LineElement, Title, Tooltip, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler);

/* ─── Animation variants ─────────────────────────────────────── */
const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } }
};
const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1] } }
};

/* ─── Stat Card ──────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, delta, color = '#2563eb', delay = 0 }) => (
    <motion.div
        variants={item}
        whileHover={{ y: -3, boxShadow: '0 16px 48px rgba(0,0,0,0.1)' }}
        className="stat-card"
        style={{ cursor: 'default' }}
    >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: `${color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
                <Icon size={20} color={color} />
            </div>
            {delta && (
                <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                    <ArrowUpRight size={11} /> {delta}
                </span>
            )}
        </div>
        <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text-1)', lineHeight: 1 }}>
            {value}
        </div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-2)', marginTop: '0.4rem', fontWeight: 500 }}>
            {label}
        </div>
    </motion.div>
);

/* ─── Score Ring ─────────────────────────────────────────────── */
const ScoreRing = ({ score }) => {
    const r = 52;
    const circ = 2 * Math.PI * r;
    const filled = (score / 100) * circ;
    const color = score >= 70 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626';

    return (
        <div style={{ position: 'relative', width: 128, height: 128 }}>
            <svg width="128" height="128" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="64" cy="64" r={r} fill="none" stroke="#f0f0f0" strokeWidth="10" />
                <motion.circle
                    cx="64" cy="64" r={r} fill="none"
                    stroke={color} strokeWidth="10"
                    strokeDasharray={`${circ}`}
                    initial={{ strokeDashoffset: circ }}
                    animate={{ strokeDashoffset: circ - filled }}
                    transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                    strokeLinecap="round"
                />
            </svg>
            <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
            }}>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{score}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-3)', fontWeight: 600, letterSpacing: '0.04em' }}>ATS</div>
            </div>
        </div>
    );
};

/* ─── Resume Row ─────────────────────────────────────────────── */
const ResumeRow = ({ resume, index }) => {
    const navigate = useNavigate();
    const score = resume.atsScore || 0;
    const color = score >= 70 ? '#16a34a' : score >= 50 ? '#d97706' : '#dc2626';
    const bgColor = score >= 70 ? '#dcfce7' : score >= 50 ? '#fef9c3' : '#fee2e2';

    return (
        <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.06, duration: 0.35 }}
            onClick={() => navigate(`/resumes/${resume._id}`)}
            style={{
                display: 'flex', alignItems: 'center', gap: '1rem',
                padding: '1rem 1.25rem', borderRadius: 14,
                cursor: 'pointer', transition: 'all 0.2s',
                border: '1px solid transparent'
            }}
            whileHover={{ background: '#fafafa', borderColor: 'rgba(0,0,0,0.06)' }}
        >
            <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: '#f0f4ff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                <FileText size={18} color="#2563eb" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {resume.fileName}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-3)', marginTop: '0.1rem' }}>
                    {new Date(resume.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                {/* Mini progress */}
                <div style={{ width: 80 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-3)' }}>ATS</span>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color }}>{score}%</span>
                    </div>
                    <div className="progress-bar">
                        <motion.div
                            className="progress-fill"
                            style={{ background: color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                    </div>
                </div>
                <ChevronRight size={16} color="var(--text-3)" />
            </div>
        </motion.div>
    );
};

/* ─── Dashboard ──────────────────────────────────────────────── */
const Dashboard = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/resumes')
            .then(res => setResumes(res.data.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const sorted = [...resumes].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    const avgScore = resumes.length ? Math.round(resumes.reduce((s, r) => s + (r.atsScore || 0), 0) / resumes.length) : 0;
    const best = resumes.reduce((b, r) => (r.atsScore || 0) > (b?.atsScore || 0) ? r : b, null);
    const topSkills = best?.parsedData?.skills?.slice(0, 5) || [];

    const chartData = {
        labels: sorted.map(r => new Date(r.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })),
        datasets: [{
            fill: true,
            data: sorted.map(r => r.atsScore || 0),
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37,99,235,0.06)',
            tension: 0.4,
            pointRadius: 5,
            pointBackgroundColor: '#2563eb',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#fff', titleColor: '#0a0a0a', bodyColor: '#525252', borderColor: 'rgba(0,0,0,0.08)', borderWidth: 1, padding: 12, cornerRadius: 10, boxShadow: '0 4px 16px rgba(0,0,0,0.1)' } },
        scales: {
            x: { grid: { display: false }, border: { display: false }, ticks: { color: '#a3a3a3', font: { size: 11 } } },
            y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.04)' }, border: { display: false }, ticks: { color: '#a3a3a3', font: { size: 11 }, callback: v => `${v}` } }
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
            <div className="spinner" />
        </div>
    );

    return (
        <div>
            {/* Page header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2rem', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}
            >
                <div>
                    <p className="section-label"><Zap size={12} /> Overview</p>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-2)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Track your resume performance and job readiness.
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="btn btn-primary"
                    onClick={() => navigate('/resumes')}
                >
                    <FileText size={16} /> Upload Resume
                </motion.button>
            </motion.div>

            {/* Stats Row */}
            <motion.div
                variants={container} initial="hidden" animate="show"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}
            >
                <StatCard icon={FileText} label="Total Resumes" value={resumes.length} color="#2563eb" delta={resumes.length > 0 ? '+' + resumes.length : null} />
                <StatCard icon={TrendingUp} label="Avg ATS Score" value={`${avgScore}%`} color="#7c3aed" delta={avgScore > 60 ? 'Good' : null} />
                <StatCard icon={Briefcase} label="Jobs Matched" value="40+" color="#16a34a" delta="Live" />
                <StatCard icon={CheckCircle2} label="Best Score" value={best ? `${best.atsScore}%` : '—'} color="#d97706" />
            </motion.div>

            {/* Main content grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem', alignItems: 'start' }}>

                {/* Left: Chart + Resume list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* ATS Progress Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                        className="card"
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                            <div>
                                <p className="section-label"><TrendingUp size={12} /> Progress</p>
                                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>ATS Score Over Time</h3>
                            </div>
                            {resumes.length > 0 && (
                                <span className="badge badge-info">{resumes.length} resumes</span>
                            )}
                        </div>
                        <div style={{ height: 200 }}>
                            {resumes.length > 0 ? (
                                <Line data={chartData} options={chartOptions} />
                            ) : (
                                <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-3)' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <TrendingUp size={36} style={{ marginBottom: 8, opacity: 0.3 }} />
                                        <p style={{ fontSize: '0.875rem' }}>Upload your first resume to see progress</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {/* Recent Resumes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                        className="card"
                        style={{ padding: '1.5rem' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                            <div>
                                <p className="section-label"><Clock size={12} /> Recent</p>
                                <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Your Resumes</h3>
                            </div>
                            <button className="btn btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }} onClick={() => navigate('/resumes')}>
                                View all <ChevronRight size={14} />
                            </button>
                        </div>
                        {resumes.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '2.5rem 0', color: 'var(--text-3)' }}>
                                <FileText size={32} style={{ marginBottom: 8, opacity: 0.3 }} />
                                <p style={{ fontSize: '0.875rem' }}>No resumes yet. Upload one to get started!</p>
                                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn btn-primary" style={{ marginTop: '1rem', fontSize: '0.85rem' }} onClick={() => navigate('/resumes')}>
                                    Upload Resume
                                </motion.button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {resumes.slice(0, 5).map((r, i) => <ResumeRow key={r._id} resume={r} index={i} />)}
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Right sidebar cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Best Resume Score */}
                    {best && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                            className="card"
                            style={{ textAlign: 'center' }}
                        >
                            <p className="section-label" style={{ justifyContent: 'center' }}><Star size={12} /> Top Resume</p>
                            <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                                <ScoreRing score={best.atsScore || 0} />
                            </div>
                            <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {best.fileName}
                            </h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-3)', marginTop: '0.25rem' }}>Best performing</p>
                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                className="btn btn-secondary"
                                style={{ width: '100%', marginTop: '1.25rem', fontSize: '0.85rem' }}
                                onClick={() => navigate(`/resumes/${best._id}`)}
                            >
                                View Details <ArrowUpRight size={14} />
                            </motion.button>
                        </motion.div>
                    )}

                    {/* Top Skills */}
                    {topSkills.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
                            className="card"
                        >
                            <p className="section-label"><Zap size={12} /> Skills</p>
                            <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>Top Skills Detected</h3>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                {topSkills.map((s, i) => (
                                    <motion.span
                                        key={i} className="pill"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: 0.4 + i * 0.05 }}
                                    >
                                        {s}
                                    </motion.span>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Quick actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                        className="card"
                    >
                        <p className="section-label"><Zap size={12} /> Quick Actions</p>
                        <h3 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '1rem' }}>What's next?</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {[
                                { label: 'Find Matching Jobs', icon: Briefcase, path: '/jobs', color: '#2563eb' },
                                { label: 'Analyze with AI', icon: Zap, path: '/analyze', color: '#7c3aed' },
                                { label: 'Compare Resumes', icon: TrendingUp, path: '/compare', color: '#16a34a' },
                            ].map(({ label, icon: Icon, path, color }) => (
                                <motion.button
                                    key={path}
                                    whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                                    onClick={() => navigate(path)}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '0.75rem',
                                        padding: '0.75rem', borderRadius: 12,
                                        background: 'transparent', border: '1px solid var(--border)',
                                        cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                                        fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-1)'
                                    }}
                                    onMouseOver={e => { e.currentTarget.style.background = '#fafafa'; e.currentTarget.style.borderColor = 'rgba(0,0,0,0.1)'; }}
                                    onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                                >
                                    <div style={{ width: 32, height: 32, borderRadius: 8, background: `${color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Icon size={16} color={color} />
                                    </div>
                                    {label}
                                    <ChevronRight size={14} color="var(--text-3)" style={{ marginLeft: 'auto' }} />
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
