import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import { FileText, MoreVertical, Trash2, Eye } from 'lucide-react';
import api from '../api/client';

const Resumes = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openMenu, setOpenMenu] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const menuRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchResumes();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchResumes = async () => {
        try {
            setLoading(true);
            const res = await api.get('/resumes');
            setResumes(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (resumeId) => {
        if (!window.confirm('Delete this resume? This cannot be undone.')) return;
        setDeletingId(resumeId);
        setOpenMenu(null);
        try {
            await api.delete(`/resumes/${resumeId}`);
            setResumes(prev => prev.filter(r => r._id !== resumeId));
        } catch (err) {
            console.error('Delete failed:', err);
            alert('Failed to delete resume. Please try again.');
        } finally {
            setDeletingId(null);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--success-color)';
        if (score >= 60) return '#f59e0b';
        return 'var(--danger-color)';
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>My Resumes</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Manage and compare different versions of your professional profiles.</p>
                </div>
                <Button onClick={() => navigate('/upload')}>Upload New</Button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem' }}>
                    <div className="spinner" style={{ margin: '0 auto' }}></div>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {resumes.map((resume) => (
                        <Card key={resume._id} style={{ position: 'relative' }}>
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div style={{
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    color: 'var(--accent-color)'
                                }}>
                                    <FileText size={24} />
                                </div>

                                {/* Three-dot menu */}
                                <div style={{ position: 'relative' }} ref={openMenu === resume._id ? menuRef : null}>
                                    <button
                                        style={{ background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenMenu(openMenu === resume._id ? null : resume._id);
                                        }}
                                    >
                                        <MoreVertical size={20} />
                                    </button>

                                    {openMenu === resume._id && (
                                        <div style={{
                                            position: 'absolute',
                                            right: 0,
                                            top: '100%',
                                            background: 'var(--card-bg, #1a1a2e)',
                                            border: '1px solid var(--border-color)',
                                            borderRadius: '10px',
                                            padding: '0.5rem',
                                            zIndex: 100,
                                            minWidth: '160px',
                                            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                                        }}>
                                            <button
                                                onClick={() => { setOpenMenu(null); navigate(`/resumes/${resume._id}`); }}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                                                    padding: '0.6rem 0.75rem', background: 'transparent', color: 'var(--text-primary)',
                                                    borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <Eye size={15} /> View Details
                                            </button>
                                            <button
                                                onClick={() => handleDelete(resume._id)}
                                                disabled={deletingId === resume._id}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                                                    padding: '0.6rem 0.75rem', background: 'transparent', color: '#ef4444',
                                                    borderRadius: '6px', cursor: 'pointer', textAlign: 'left', fontSize: '0.875rem',
                                                }}
                                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                            >
                                                <Trash2 size={15} /> {deletingId === resume._id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem', wordBreak: 'break-word' }}>{resume.fileName}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                Analyzed on {new Date(resume.createdAt).toLocaleDateString()}
                            </p>

                            {/* Stats */}
                            <div style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '1rem', background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '12px', marginBottom: '1.5rem'
                            }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ATS Score</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: getScoreColor(resume.atsScore) }}>
                                        {resume.atsScore}%
                                    </p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Skills</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{resume.parsedData?.skills?.length || 0}</p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <Button
                                    variant="secondary"
                                    style={{ flex: 1, padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                                    onClick={() => navigate(`/resumes/${resume._id}`)}
                                >
                                    <Eye size={16} /> View
                                </Button>
                                <Button
                                    variant="outline"
                                    style={{ flex: 1, padding: '0.5rem' }}
                                    onClick={() => navigate('/analyze', { state: { resumeId: resume._id } })}
                                >
                                    Match
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {resumes.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem', border: '1px dashed var(--border-color)', borderRadius: '16px' }}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>You haven't uploaded any resumes yet.</p>
                            <Button onClick={() => navigate('/upload')}>Get Started</Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Resumes;
