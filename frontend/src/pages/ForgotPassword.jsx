import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/Common';
import { Brain, ArrowLeft, Mail, Key, Lock } from 'lucide-react';
import api from '../api/client';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1 = Request OTP, 2 = Verify OTP & Reset Password
    
    // Step 1 State
    const [email, setEmail] = useState('');
    
    // Step 2 State
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Common State
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/forgot-password', { email });
            setMessage(res.data.message || 'OTP sent to your email.');
            setStep(2);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!otp || !newPassword || !confirmPassword) {
            setError('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/auth/reset-password', {
                email,
                otp,
                newPassword
            });
            setMessage(res.data.message || 'Password reset successful!');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'var(--bg-color)',
            backgroundImage: 'radial-gradient(circle at top, rgba(59, 130, 246, 0.1) 0%, transparent 40%)'
        }}>
            <div style={{ width: '100%', maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        background: 'rgba(59, 130, 246, 0.1)',
                        padding: '1rem',
                        borderRadius: '16px',
                        marginBottom: '1.5rem',
                        color: 'var(--accent-color)'
                    }}>
                        <Brain size={40} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', fontFamily: 'Outfit' }}>Password Reset</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Recover access to your HireSnap account</p>
                </div>

                <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px' }}>
                    {error && (
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            borderRadius: '12px',
                            color: '#ef4444',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem'
                        }}>
                            {error}
                        </div>
                    )}
                    
                    {message && (
                        <div style={{
                            padding: '1rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '12px',
                            color: '#10b981',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem'
                        }}>
                            {message}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleRequestOtp}>
                            <div style={{ marginBottom: '1.25rem' }}>
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <Button 
                                type="submit" 
                                style={{ width: '100%', marginTop: '1rem' }}
                                disabled={loading}
                            >
                                {loading ? 'Sending OTP...' : 'Send Reset Code'}
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword}>
                            <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                    We sent a 6-digit code to <strong>{email}</strong>
                                </p>
                            </div>
                            
                            <div style={{ marginBottom: '1.25rem' }}>
                                <input
                                    type="text"
                                    placeholder="6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength={6}
                                    required
                                />
                            </div>
                            
                            <div style={{ marginBottom: '1.25rem' }}>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <div style={{ marginBottom: '1.25rem' }}>
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            
                            <Button 
                                type="submit" 
                                style={{ width: '100%', marginTop: '1rem' }}
                                disabled={loading}
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </Button>
                        </form>
                    )}

                    <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                        <Link to="/login" style={{ 
                            color: 'var(--text-secondary)', 
                            textDecoration: 'none', 
                            fontSize: '0.875rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'color 0.2s',
                        }}
                        onMouseOver={(e) => e.target.style.color = 'var(--text-primary)'}
                        onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
                        >
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
