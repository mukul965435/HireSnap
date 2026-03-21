import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FileText, Sparkles, Send, Copy, Download, RefreshCw, 
    ChevronRight, AlertCircle, Check, Briefcase, Wand2 
} from 'lucide-react';
import api from '../api/client';
import { useLocation } from 'react-router-dom';

const CoverLetterGenerator = () => {
    const location = useLocation();
    const [resumes, setResumes] = useState([]);
    const [selectedResume, setSelectedResume] = useState(location.state?.resumeId || '');
    const [jobDescription, setJobDescription] = useState('');
    const [tone, setTone] = useState('formal');
    const [loading, setLoading] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [displayedText, setDisplayedText] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchResumes = async () => {
            try {
                const res = await api.get('/resumes');
                const data = res.data.data || [];
                setResumes(data);
                if (data.length > 0 && !selectedResume) {
                    setSelectedResume(data[0]._id);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchResumes();
    }, [selectedResume]);

    // Typing effect for the AI output
    useEffect(() => {
        if (!coverLetter) {
            setDisplayedText('');
            return;
        }
        
        let index = 0;
        setDisplayedText('');
        const interval = setInterval(() => {
            if (index < coverLetter.length) {
                setDisplayedText(prev => prev + coverLetter[index]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 10); // Fast typing

        return () => clearInterval(interval);
    }, [coverLetter]);

    const handleGenerate = async () => {
        if (!selectedResume || !jobDescription) return;
        setLoading(true);
        setError('');
        setCoverLetter(''); // Reset current
        try {
            const res = await api.post('/resumes/generate-cover-letter', {
                resumeId: selectedResume,
                jobDescription,
                tone
            });
            setCoverLetter(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to generate cover letter. Ensure your resume and job description are provided.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(coverLetter);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement("a");
        const file = new Blob([coverLetter], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = "CoverLetter.txt";
        document.body.appendChild(element);
        element.click();
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ marginBottom: '2.5rem' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{ padding: '0.75rem', borderRadius: 16, background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: 'white' }}>
                        <Wand2 size={24} />
                    </div>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em' }}>AI Cover Letter Generator</h1>
                        <p style={{ color: '#737373', fontSize: '1rem' }}>Create personalized, high-impact cover letters matching your resume to any job.</p>
                    </div>
                </div>
            </motion.div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
                
                {/* Left Side: Inputs */}
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
                >
                    <div style={{ background: 'white', borderRadius: 24, padding: '2rem', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 24px rgba(0,0,0,0.02)' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: '#404040' }}>
                                <FileText size={16} /> Select Resume
                            </label>
                            <select 
                                value={selectedResume} 
                                onChange={(e) => setSelectedResume(e.target.value)}
                                style={{ width: '100%', padding: '0.85rem', borderRadius: 14, border: '1px solid #e5e5e5', background: '#f9fafb', fontSize: '0.95rem' }}
                            >
                                {resumes.map(r => (
                                    <option key={r._id} value={r._id}>{r.fileName}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: '#404040' }}>
                                <Briefcase size={16} /> Job Description
                            </label>
                            <textarea
                                rows={10}
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the job description here..."
                                style={{ width: '100%', padding: '1rem', borderRadius: 16, border: '1px solid #e5e5e5', background: '#f9fafb', fontSize: '0.95rem', resize: 'none', lineHeight: 1.6 }}
                            />
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 600, color: '#404040' }}>Select Tone</label>
                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                {['formal', 'confident', 'friendly'].map((t) => (
                                    <button
                                        key={t}
                                        onClick={() => setTone(t)}
                                        style={{ 
                                            flex: 1, padding: '0.6rem', borderRadius: 12, border: '1px solid',
                                            borderColor: tone === t ? '#2563eb' : '#e5e5e5',
                                            background: tone === t ? '#eff6ff' : 'white',
                                            color: tone === t ? '#2563eb' : '#737373',
                                            fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', textTransform: 'capitalize',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading || !jobDescription}
                            style={{ 
                                width: '100%', padding: '1rem', borderRadius: 16, background: '#0a0a0a', 
                                color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                                opacity: (loading || !jobDescription) ? 0.6 : 1, transition: 'all 0.2s'
                            }}
                        >
                            {loading ? (
                                <RefreshCw className="animate-spin" size={20} />
                            ) : (
                                <><Sparkles size={20} /> Generate Cover Letter</>
                            )}
                        </button>
                        
                        <AnimatePresence>
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    style={{ marginTop: '1.25rem', padding: '0.75rem', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 12, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}
                                >
                                    <AlertCircle size={14} /> {error}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Right Side: Output */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    {!coverLetter && !loading ? (
                        <div style={{ 
                            height: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column', 
                            alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.4)', 
                            borderRadius: 24, border: '2px dashed #e5e5e5', padding: '2rem', textAlign: 'center' 
                        }}>
                            <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                                <Send size={28} color="#a3a3a3" />
                            </div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#404040', marginBottom: '0.5rem' }}>Ready to write?</h3>
                            <p style={{ color: '#737373', maxWidth: '300px' }}>Select a resume and paste the job description to generate your letter.</p>
                        </div>
                    ) : (
                        <div style={{ 
                            background: 'white', borderRadius: 24, padding: '2rem', minHeight: '600px', 
                            border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
                            display: 'flex', flexDirection: 'column'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <FileText size={18} color="#2563eb" />
                                    <span style={{ fontWeight: 700, color: '#0a0a0a', fontSize: '1rem' }}>Your Generated Cover Letter</span>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button 
                                        onClick={handleCopy}
                                        style={{ padding: '0.5rem 1rem', borderRadius: 10, background: '#f5f5f5', border: '1px solid #e5e5e5', color: '#404040', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                    >
                                        {copied ? <Check size={14} color="#16a34a" /> : <Copy size={14} />}
                                        {copied ? 'Copied' : 'Copy'}
                                    </button>
                                    <button 
                                        onClick={handleDownload}
                                        style={{ padding: '0.5rem 1rem', borderRadius: 10, background: '#0a0a0a', border: 'none', color: 'white', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                                    >
                                        <Download size={14} /> Download
                                    </button>
                                </div>
                            </div>

                            <div style={{ flex: 1, position: 'relative' }}>
                                <textarea
                                    value={displayedText}
                                    onChange={(e) => setCoverLetter(e.target.value)}
                                    style={{ 
                                        width: '100%', height: '500px', border: 'none', background: 'transparent',
                                        fontSize: '1rem', lineHeight: 1.7, color: '#262626', fontFamily: "'Inter', sans-serif",
                                        resize: 'none', outline: 'none'
                                    }}
                                />
                                {loading && (
                                    <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}>
                                        <RefreshCw size={16} className="animate-spin" /> AI is writing...
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default CoverLetterGenerator;
