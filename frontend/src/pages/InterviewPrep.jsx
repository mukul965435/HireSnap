import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    MessageSquare, Sparkles, Send, Copy, RefreshCw, 
    FileText, Check, AlertCircle, Code, Briefcase, UserCheck 
} from 'lucide-react';
import api from '../api/client';
import { Card, Button } from '../components/Common';

const InterviewPrep = () => {
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState('');
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await api.get('/resumes');
                const data = res.data.data || [];
                setResumes(data);
                if (data.length > 0) {
                    setSelectedResumeId(data[0]._id);
                }
            } catch (err) {
                console.error('Fetch Resumes Error:', err);
            }
        };
        fetchResumes();
    }, []);

    const handleGenerate = async () => {
        if (!selectedResumeId) return;
        
        const resume = resumes.find(r => r._id === selectedResumeId);
        if (!resume) return;

        setLoading(true);
        setError('');
        setQuestions(null);
        
        try {
            const res = await api.post('/interview/questions', {
                resumeText: resume.rawText
            });
            setQuestions(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate questions. Is the AI server running?');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyAll = () => {
        if (!questions) return;
        const text = `
TECHNICAL QUESTIONS:
${questions.technical.join('\n')}

PROJECT-BASED QUESTIONS:
${questions.project.join('\n')}

HR ROUND QUESTIONS:
${questions.hr.join('\n')}
        `.trim();
        
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const Section = ({ title, icon: Icon, items, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            style={{ marginBottom: '2rem' }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ padding: '0.6rem', background: '#f8fafc', borderRadius: 12, color: '#2563eb' }}>
                    <Icon size={20} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{title}</h3>
            </div>
            <div style={{ display: 'grid', gap: '1rem' }}>
                {items.map((item, i) => (
                    <motion.div
                        key={i}
                        whileHover={{ x: 4 }}
                        style={{ 
                            padding: '1.25rem', 
                            background: 'white', 
                            borderRadius: 16, 
                            border: '1px solid rgba(0,0,0,0.06)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                            display: 'flex',
                            gap: '1rem'
                        }}
                    >
                        <span style={{ color: '#2563eb', fontWeight: 800, fontSize: '0.9rem', opacity: 0.5 }}>0{i+1}</span>
                        <p style={{ color: '#334155', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>{item}</p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );

    const Skeleton = () => (
        <div style={{ display: 'grid', gap: '2rem' }}>
            {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                    <div style={{ height: 28, width: 200, background: '#e2e8f0', borderRadius: 8, marginBottom: '1.25rem' }} />
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {[1, 2, 3, 4, 5].map(j => (
                            <div key={j} style={{ height: 80, background: '#f1f5f9', borderRadius: 16 }} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '3rem', textAlign: 'center' }}
            >
                <div style={{ 
                    display: 'inline-flex', padding: '0.75rem', borderRadius: 20, 
                    background: 'linear-gradient(135deg, #2563eb, #7c3aed)', 
                    color: 'white', marginBottom: '1.5rem', boxShadow: '0 8px 16px rgba(37, 99, 235, 0.2)' 
                }}>
                    <MessageSquare size={32} />
                </div>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                    Interview Prep AI
                </h1>
                <p style={{ color: '#64748b', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
                    Generate realistic, project-specific interview questions tailored exactly to your resume experience.
                </p>
            </motion.div>

            <Card style={{ padding: '2rem', marginBottom: '3rem', borderRadius: 24 }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#64748b', marginBottom: '0.6rem' }}>
                            Select Your Resume
                        </label>
                        <select 
                            value={selectedResumeId} 
                            onChange={(e) => setSelectedResumeId(e.target.value)}
                            style={{ 
                                width: '100%', padding: '0.85rem 1rem', borderRadius: 14, 
                                border: '1px solid #e2e8f0', background: '#f8fafc', 
                                outline: 'none', fontSize: '1rem', fontWeight: 500, color: '#0f172a'
                            }}
                        >
                            {resumes.map(r => (
                                <option key={r._id} value={r._id}>{r.fileName}</option>
                            ))}
                        </select>
                    </div>
                    <div style={{ paddingTop: '1.5rem' }}>
                        <Button 
                            onClick={handleGenerate} 
                            disabled={loading || !selectedResumeId}
                            style={{ 
                                height: '52px', padding: '0 2rem', borderRadius: 14, 
                                display: 'flex', alignItems: 'center', gap: '0.75rem',
                                boxShadow: '0 4px 12px rgba(37, 99, 235, 0.15)'
                            }}
                        >
                            {loading ? (
                                <><RefreshCw size={18} className="animate-spin" /> Generating...</>
                            ) : (
                                <><Sparkles size={18} /> Generate Questions</>
                            )}
                        </Button>
                    </div>
                </div>
            </Card>

            <AnimatePresence mode="wait">
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        style={{ 
                            padding: '1.25rem', background: '#fef2f2', border: '1px solid #fee2e2', 
                            borderRadius: 16, color: '#dc2626', display: 'flex', alignItems: 'center', 
                            gap: '1rem', marginBottom: '2rem', fontWeight: 500
                        }}
                    >
                        <AlertCircle size={20} />
                        {error}
                    </motion.div>
                )}

                {loading && <Skeleton />}

                {questions && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
                            <button 
                                onClick={handleCopyAll}
                                style={{ 
                                    padding: '0.6rem 1.25rem', borderRadius: 12, background: 'white', 
                                    border: '1px solid #e2e8f0', color: '#475569', fontWeight: 600, 
                                    fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
                                {copied ? 'Copied Everything!' : 'Copy All Questions'}
                            </button>
                            <button 
                                onClick={handleGenerate}
                                style={{ 
                                    padding: '0.6rem 1.25rem', borderRadius: 12, background: '#0f172a', 
                                    border: 'none', color: 'white', fontWeight: 600, 
                                    fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    transition: 'all 0.2s'
                                }}
                            >
                                <RefreshCw size={16} /> Regenerate
                            </button>
                        </div>

                        <Section 
                            title="Technical Round" 
                            icon={Code} 
                            items={questions.technical} 
                            delay={0.1} 
                        />
                        <Section 
                            title="Project Discussions" 
                            icon={Briefcase} 
                            items={questions.project} 
                            delay={0.2} 
                        />
                        <Section 
                            title="HR & Behavioral" 
                            icon={UserCheck} 
                            items={questions.hr} 
                            delay={0.3} 
                        />
                    </motion.div>
                )}

                {!questions && !loading && !error && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        style={{ 
                            textAlign: 'center', padding: '4rem 2rem', background: '#f8fafc', 
                            borderRadius: 32, border: '2px dashed #e2e8f0' 
                        }}
                    >
                        <div style={{ width: 80, height: 80, background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                            <FileText size={40} color="#94a3b8" />
                        </div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>No Questions Yet</h3>
                        <p style={{ color: '#94a3b8', maxWidth: '300px', margin: '0 auto' }}>Select a resume and click generate to start your preparation.</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InterviewPrep;
