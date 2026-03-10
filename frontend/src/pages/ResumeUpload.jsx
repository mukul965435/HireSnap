import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/Common';
import { Upload, File, X, Check } from 'lucide-react';
import api from '../api/client';

const ResumeUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 5 * 1024 * 1024) {
                setError('File size too large (max 5MB)');
                return;
            }
            setFile(selectedFile);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setLoading(true);
        setError('');

        const formData = new FormData();
        formData.append('resume', file);

        try {
            await api.post('/resumes/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            navigate('/resumes');
        } catch (err) {
            console.error('Upload Error:', err.message, err.response?.data);

            if (err.code === 'ECONNABORTED') {
                setError('AI is still processing. Check your Resumes page in a moment.');
            } else if (!err.response) {
                // Network error - no response from server
                setError(`Network error: ${err.message}. Make sure Ollama is running and the backend is up.`);
            } else {
                setError(err.response.data?.message || err.message || 'Failed to analyze resume.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2.5rem' }}>
                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Upload Resume</h1>
                <p style={{ color: 'var(--text-secondary)' }}>Supported formats: PDF, DOCX (Max 5MB)</p>
            </div>

            <Card>
                <div
                    style={{
                        border: '2px dashed var(--border-color)',
                        borderRadius: '16px',
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.02)',
                        cursor: 'pointer',
                        transition: 'var(--transition-smooth)'
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                        e.preventDefault();
                        const droppedFile = e.dataTransfer.files[0];
                        if (droppedFile) setFile(droppedFile);
                    }}
                    onClick={() => document.getElementById('file-upload').click()}
                >
                    <input
                        id="file-upload"
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                        accept=".pdf,.docx"
                    />

                    {!file ? (
                        <>
                            <div style={{
                                background: 'rgba(59, 130, 246, 0.1)',
                                color: 'var(--accent-color)',
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                <Upload size={32} />
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>Click to upload or drag and drop</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Your resume will be processed using AI to extract skills and experience.</p>
                        </>
                    ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                            <div style={{
                                background: 'rgba(16, 185, 129, 0.1)',
                                color: 'var(--success-color)',
                                padding: '1rem',
                                borderRadius: '12px'
                            }}>
                                <File size={32} />
                            </div>
                            <div style={{ textAlign: 'left' }}>
                                <h3 style={{ fontSize: '1.125rem' }}>{file.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                style={{ background: 'transparent', color: 'var(--text-secondary)', marginLeft: '1rem' }}
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}
                </div>

                {error && <p style={{ color: 'var(--danger-color)', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}

                <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <Button variant="secondary" onClick={() => navigate('/resumes')}>Cancel</Button>
                    <Button
                        onClick={handleUpload}
                        disabled={!file || loading}
                    >
                        {loading ? 'Analyzing...' : 'Process Resume'}
                    </Button>
                </div>
            </Card>

            {loading && (
                <div style={{
                    marginTop: '2rem',
                    padding: '1.5rem',
                    background: 'rgba(59, 130, 246, 0.05)',
                    borderRadius: '12px',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div className="spinner" style={{
                        width: '20px',
                        height: '20px',
                        border: '2px solid rgba(255, 255, 255, 0.1)',
                        borderTopColor: 'var(--accent-color)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    <p style={{ fontSize: '0.875rem' }}>
                        Our AI is extracting your technical skills, work history, and education. This usually takes 10-20 seconds.
                    </p>
                </div>
            )}
        </div>
    );
};

export default ResumeUpload;
