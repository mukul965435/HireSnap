import React, { useState, useEffect } from 'react';
import { Button, Card } from '../components/Common';
import { Search, ChevronRight, Brain, AlertCircle, Sparkles } from 'lucide-react';
import api from '../api/client';

const AIAnalyzer = () => {
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await api.get('/resumes');
                setResumes(res.data.data);
                if (res.data.data.length > 0) setSelectedResume(res.data.data[0]._id);
            } catch (err) {
                console.error(err);
            }
        };
        fetchResumes();
    }, []);

    const handleCompare = async () => {
        if (!selectedResume || !jobDescription) return;

        setLoading(true);
        setError('');
        try {
            const res = await api.post('/resumes/compare', {
                resumeId: selectedResume,
                jobDescription
            });
            setResult(res.data.data);
        } catch (err) {
            setError('Failed to analyze. Please check your inputs.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>AI Job Matcher</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Compare your resume against a specific job description to identify gaps.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <Card title="Configuration">
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Select Resume</label>
                            <select value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)}>
                                {resumes.map(r => (
                                    <option key={r._id} value={r._id}>{r.fileName}</option>
                                ))}
                            </select>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Job Description</label>
                            <textarea
                                rows={12}
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here..."
                            />
                        </div>
                        <Button
                            style={{ width: '100%' }}
                            onClick={handleCompare}
                            disabled={loading || !jobDescription}
                        >
                            {loading ? 'Analyzing...' : 'Run Match Analysis'}
                        </Button>
                        {error && <p style={{ color: 'var(--danger-color)', marginTop: '1rem', fontSize: '0.875rem' }}>{error}</p>}
                    </Card>
                </div>

                <div>
                    {!result && !loading && (
                        <div style={{
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            padding: '3rem',
                            border: '1px dashed var(--border-color)',
                            borderRadius: '16px',
                            color: 'var(--text-secondary)'
                        }}>
                            <Brain size={48} style={{ marginBottom: '1.5rem', opacity: 0.5 }} />
                            <h3>Analysis Results</h3>
                            <p>Select a resume and paste a job description to see the magic happen.</p>
                        </div>
                    )}

                    {loading && (
                        <div style={{ textAlign: 'center', padding: '5rem' }}>
                            <div className="spinner" style={{
                                width: '40px',
                                height: '40px',
                                border: '3px solid rgba(255, 255, 255, 0.1)',
                                borderTopColor: 'var(--accent-color)',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite',
                                margin: '0 auto 1.5rem'
                            }}></div>
                            <h3 style={{ marginBottom: '0.5rem' }}>AI is thinking...</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>Comparing semantic embeddings and identifying skill gaps.</p>
                        </div>
                    )}

                    {result && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Card>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                                    <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                                        <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)' }}>
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#222" strokeWidth="3" />
                                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="var(--accent-color)" strokeWidth="3" strokeDasharray={`${result.compatibilityScore}, 100`} />
                                        </svg>
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 800 }}>
                                            {result.compatibilityScore}%
                                        </div>
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.25rem' }}>Compatibility Score</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Based on keyword matching and semantic similarity.</p>
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f59e0b' }}>
                                        <AlertCircle size={18} /> Missing Keywords
                                    </h4>
                                    <div style={{ display: 'flex', wrap: 'wrap', gap: '0.5rem' }}>
                                        {result.missingKeywords.map((k, i) => (
                                            <span key={i} style={{
                                                background: 'rgba(245, 158, 11, 0.1)',
                                                color: '#f59e0b',
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: 600
                                            }}>{k}</span>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ marginBottom: '2rem' }}>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}>
                                        <Sparkles size={18} /> Improvements
                                    </h4>
                                    <ul style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', paddingLeft: '1.25rem' }}>
                                        {result.improvements.map((imp, i) => (
                                            <li key={i} style={{ marginBottom: '0.5rem' }}>{imp}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--success-color)' }}>
                                        <CheckCircle size={18} /> Optimized Bullet Points
                                    </h4>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {result.optimizedBullets.map((bullet, i) => (
                                            <div key={i} style={{
                                                padding: '1rem',
                                                background: 'rgba(16, 185, 129, 0.05)',
                                                borderRadius: '10px',
                                                fontSize: '0.875rem',
                                                border: '1px solid rgba(16, 185, 129, 0.1)'
                                            }}>{bullet}</div>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Reuse CSS spin animation
const style = document.createElement('style');
style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);

const CheckCircle = ({ size, color }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

export default AIAnalyzer;
