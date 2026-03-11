import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import { ArrowLeft, CheckCircle, XCircle, FileText, ArrowRight } from 'lucide-react';
import api from '../api/client';

const CompareVersions = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const [resumes, setResumes] = useState([]);
    const [resumeAId, setResumeAId] = useState(location.state?.resumeId || '');
    const [resumeBId, setResumeBId] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await api.get('/resumes');
                const fetched = res.data.data;
                setResumes(fetched);
                
                if (fetched.length >= 2) {
                    // pre-select if not provided
                    if (!resumeAId) setResumeAId(fetched[1]._id); // Older
                    if (!resumeBId) setResumeBId(fetched[0]._id); // Newer
                } else if (fetched.length === 1) {
                    if (!resumeAId) setResumeAId(fetched[0]._id);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchResumes();
    }, [resumeAId, resumeBId]);

    const resumeA = resumes.find(r => r._id === resumeAId);
    const resumeB = resumes.find(r => r._id === resumeBId);

    const getScoreColor = (score) => {
        if (score >= 80) return '#10b981';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const calculateDifferences = () => {
        if (!resumeA || !resumeB) return null;

        const skillsA = resumeA.parsedData.skills || [];
        const skillsB = resumeB.parsedData.skills || [];
        
        const addedSkills = skillsB.filter(s => !skillsA.includes(s));
        const removedSkills = skillsA.filter(s => !skillsB.includes(s));
        const retainedSkills = skillsB.filter(s => skillsA.includes(s));

        const scoreDiff = resumeB.atsScore - resumeA.atsScore;

        return {
            addedSkills,
            removedSkills,
            retainedSkills,
            scoreDiff
        };
    };

    const diff = calculateDifferences();

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
        </div>
    );

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <button
                onClick={() => navigate('/resumes')}
                style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'transparent', color: 'var(--text-secondary)',
                    marginBottom: '2rem', cursor: 'pointer', fontSize: '0.9rem',
                    padding: '0.4rem 0'
                }}
            >
                <ArrowLeft size={18} /> Back to Resumes
            </button>

            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Compare Resume Versions</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Select two resumes to view side-by-side progression and changes.</p>
            </div>

            {resumes.length < 2 ? (
                <Card style={{ textAlign: 'center', padding: '3rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Not enough resumes</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        You need at least two resumes to compare versions. Upload a new iteration of your resume!
                    </p>
                    <Button onClick={() => navigate('/upload')}>Upload Resume</Button>
                </Card>
            ) : (
                <>
                    {/* Controls */}
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Version A (Older)</label>
                            <select 
                                value={resumeAId} 
                                onChange={(e) => setResumeAId(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'white' }}
                            >
                                {resumes.map(r => (
                                    <option key={`a-${r._id}`} value={r._id}>{r.fileName} ({new Date(r.createdAt).toLocaleDateString()})</option>
                                ))}
                            </select>
                        </div>
                        <ArrowRight size={24} style={{ color: 'var(--text-secondary)', marginTop: '1.5rem' }} />
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Version B (Newer)</label>
                            <select 
                                value={resumeBId} 
                                onChange={(e) => setResumeBId(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'white' }}
                            >
                                {resumes.map(r => (
                                    <option key={`b-${r._id}`} value={r._id}>{r.fileName} ({new Date(r.createdAt).toLocaleDateString()})</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Comparison Panels */}
                    {resumeA && resumeB && diff && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            {/* Panel A */}
                            <Card style={{ borderTop: `4px solid ${getScoreColor(resumeA.atsScore)}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '50%' }}>
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem' }}>{resumeA.fileName}</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(resumeA.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>ATS Score</p>
                                    <h2 style={{ fontSize: '3rem', fontWeight: 800, color: getScoreColor(resumeA.atsScore) }}>{resumeA.atsScore}</h2>
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Skill Set ({resumeA.parsedData.skills.length})</h4>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                        {resumeA.parsedData.skills.map(s => (
                                            <span key={s} style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>{s}</span>
                                        ))}
                                    </div>
                                </div>
                            </Card>

                            {/* Panel B */}
                            <Card style={{ borderTop: `4px solid ${getScoreColor(resumeB.atsScore)}` }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                                    <div style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', padding: '0.75rem', borderRadius: '50%' }}>
                                        <FileText size={24} />
                                    </div>
                                    <div>
                                        <h3 style={{ fontSize: '1.1rem' }}>{resumeB.fileName}</h3>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{new Date(resumeB.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'center', marginBottom: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', position: 'relative' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.5rem' }}>ATS Score</p>
                                    <h2 style={{ fontSize: '3rem', fontWeight: 800, color: getScoreColor(resumeB.atsScore) }}>{resumeB.atsScore}</h2>
                                    {diff.scoreDiff !== 0 && (
                                        <div style={{ 
                                            position: 'absolute', top: '10px', right: '10px', 
                                            background: diff.scoreDiff > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                                            color: diff.scoreDiff > 0 ? '#10b981' : '#ef4444',
                                            padding: '4px 8px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold'
                                        }}>
                                            {diff.scoreDiff > 0 ? '+' : ''}{diff.scoreDiff}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Skill Set Changes</h4>
                                    
                                    {diff.addedSkills.length > 0 && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <p style={{ fontSize: '0.75rem', color: '#10b981', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12}/> Added ({diff.addedSkills.length})</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {diff.addedSkills.map(s => (
                                                    <span key={s} style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', borderRadius: '4px' }}>{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {diff.removedSkills.length > 0 && (
                                        <div style={{ marginBottom: '1rem' }}>
                                            <p style={{ fontSize: '0.75rem', color: '#ef4444', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}><XCircle size={12}/> Removed ({diff.removedSkills.length})</p>
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                                {diff.removedSkills.map(s => (
                                                    <span key={s} style={{ padding: '0.25rem 0.6rem', fontSize: '0.75rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', textDecoration: 'line-through', borderRadius: '4px' }}>{s}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div style={{ marginTop: '1.5rem' }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Retained ({diff.retainedSkills.length})</p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            {diff.retainedSkills.map(s => (
                                                <span key={s} style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.03)', borderRadius: '4px' }}>{s}</span>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </Card>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default CompareVersions;
