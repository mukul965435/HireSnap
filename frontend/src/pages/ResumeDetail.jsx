import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import { ArrowLeft, FileText, Star, Briefcase, GraduationCap, Code2 } from 'lucide-react';
import api from '../api/client';

const ResumeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await api.get(`/resumes/${id}`);
                setResume(res.data.data);
            } catch (err) {
                setError('Resume not found or you do not have permission to view it.');
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [id]);

    const getScoreColor = (score) => {
        if (score >= 80) return 'var(--success-color)';
        if (score >= 60) return '#f59e0b';
        return '#ef4444';
    };

    const getScoreLabel = (score) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Average';
        return 'Needs Work';
    };

    if (loading) return (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
            <div className="spinner" style={{ margin: '0 auto' }}></div>
        </div>
    );

    if (error) return (
        <div style={{ textAlign: 'center', padding: '5rem' }}>
            <p style={{ color: 'var(--danger-color)', marginBottom: '1rem' }}>{error}</p>
            <Button onClick={() => navigate('/resumes')}>← Back to Resumes</Button>
        </div>
    );

    const skills = resume?.parsedData?.skills || [];
    const techStack = resume?.parsedData?.techStack || [];
    const experience = resume?.parsedData?.experience || [];
    const education = resume?.parsedData?.education || [];
    const summary = resume?.parsedData?.summary || '';

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* Back button */}
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

            {/* Title */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(59,130,246,0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--accent-color)' }}>
                        <FileText size={28} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{resume.fileName}</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            Analyzed on {new Date(resume.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <Button onClick={() => navigate('/analyze', { state: { resumeId: resume._id } })}>
                    Match to Job →
                </Button>
            </div>

            {/* ATS Score Banner */}
            <Card style={{ marginBottom: '1.5rem', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{
                            width: '90px', height: '90px', borderRadius: '50%',
                            border: `5px solid ${getScoreColor(resume.atsScore)}`,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: getScoreColor(resume.atsScore) }}>
                                {resume.atsScore}
                            </span>
                            <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>/ 100</span>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>ATS Score</p>
                            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: getScoreColor(resume.atsScore) }}>
                                {getScoreLabel(resume.atsScore)}
                            </p>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                                {skills.length} skills detected
                            </p>
                        </div>
                    </div>
                    {summary && (
                        <div style={{ maxWidth: '400px', fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            "{summary}"
                        </div>
                    )}
                </div>
            </Card>

            {/* Skills */}
            <Card style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <Star size={20} color="var(--accent-color)" />
                    <h2 style={{ fontSize: '1.1rem' }}>Skills ({skills.length})</h2>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {skills.length > 0 ? skills.map((skill, i) => (
                        <span key={i} style={{
                            padding: '0.35rem 0.85rem', borderRadius: '999px',
                            background: 'rgba(59,130,246,0.12)', color: 'var(--accent-color)',
                            fontSize: '0.825rem', fontWeight: 500, border: '1px solid rgba(59,130,246,0.2)'
                        }}>{skill}</span>
                    )) : <p style={{ color: 'var(--text-secondary)' }}>No skills detected.</p>}
                </div>
            </Card>

            {/* Tech Stack */}
            {techStack.length > 0 && (
                <Card style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <Code2 size={20} color="#a855f7" />
                        <h2 style={{ fontSize: '1.1rem' }}>Tech Stack</h2>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {techStack.map((tech, i) => (
                            <span key={i} style={{
                                padding: '0.35rem 0.85rem', borderRadius: '999px',
                                background: 'rgba(168,85,247,0.1)', color: '#a855f7',
                                fontSize: '0.825rem', fontWeight: 500, border: '1px solid rgba(168,85,247,0.2)'
                            }}>{tech}</span>
                        ))}
                    </div>
                </Card>
            )}

            {/* Experience */}
            {experience.length > 0 && (
                <Card style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <Briefcase size={20} color="#10b981" />
                        <h2 style={{ fontSize: '1.1rem' }}>Experience</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {experience.map((exp, i) => (
                            <div key={i} style={{
                                padding: '1rem', background: 'rgba(255,255,255,0.03)',
                                borderRadius: '10px', borderLeft: '3px solid #10b981'
                            }}>
                                <p style={{ fontWeight: 600 }}>{exp.role}</p>
                                {exp.company && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{exp.company}</p>}
                                {exp.duration && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{exp.duration}</p>}
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* Education */}
            {education.length > 0 && (
                <Card style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                        <GraduationCap size={20} color="#f59e0b" />
                        <h2 style={{ fontSize: '1.1rem' }}>Education</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {education.map((edu, i) => (
                            <div key={i} style={{
                                padding: '1rem', background: 'rgba(255,255,255,0.03)',
                                borderRadius: '10px', borderLeft: '3px solid #f59e0b'
                            }}>
                                <p style={{ fontWeight: 600 }}>{edu.institution}</p>
                                {edu.degree && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{edu.degree}</p>}
                                {edu.year && <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{edu.year}</p>}
                            </div>
                        ))}
                    </div>
                </Card>
            )}
        </div>
    );
};

export default ResumeDetail;
