import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import { FileText, MoreVertical, Trash2, Edit3, Eye } from 'lucide-react';
import api from '../api/client';

const Resumes = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {resumes.map((resume) => (
                        <Card key={resume._id}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div style={{
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    padding: '0.75rem',
                                    borderRadius: '10px',
                                    color: 'var(--accent-color)'
                                }}>
                                    <FileText size={24} />
                                </div>
                                <button style={{ background: 'transparent', color: 'var(--text-secondary)' }}>
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{resume.fileName}</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                                Analyzed on {new Date(resume.createdAt).toLocaleDateString()}
                            </p>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.03)',
                                borderRadius: '12px',
                                marginBottom: '1.5rem'
                            }}>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>ATS Score</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--success-color)' }}>{resume.atsScore}%</p>
                                </div>
                                <div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Skills</p>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{resume.parsedData.skills.length}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <Button variant="secondary" style={{ flex: 1, padding: '0.5rem' }}>
                                    <Eye size={16} /> View
                                </Button>
                                <Button variant="outline" style={{ flex: 1, padding: '0.5rem' }} onClick={() => navigate('/analyze')}>
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
