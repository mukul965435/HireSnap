import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mail, Lock, ArrowRight, Zap, Chrome } from 'lucide-react';
import FloatingPillNav from '../components/FloatingPillNav';

const AmbientBackground = () => {
    return (
        <div style={{
            position: 'absolute', inset: 0,
            overflow: 'hidden', pointerEvents: 'none', zIndex: 0
        }}>
            {/* Soft Glows */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, 30, 0]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', top: '-10%', left: '10%',
                    width: '60vw', height: '60vw',
                    background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(80px)'
                }}
            />
            <motion.div 
                animate={{ 
                    scale: [1.2, 1, 1.2],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -40, 0],
                    y: [0, -50, 0]
                }}
                transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'absolute', bottom: '-10%', right: '10%',
                    width: '50vw', height: '50vw',
                    background: 'radial-gradient(circle, rgba(124, 58, 237, 0.08) 0%, transparent 70%)',
                    borderRadius: '50%', filter: 'blur(80px)'
                }}
            />
            
            {/* Micro-grid pattern */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)',
                backgroundSize: '32px 32px',
                opacity: 0.6
            }} />
        </div>
    );
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Mouse movement for card tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#fafafa',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            position: 'relative',
            fontFamily: "'Inter', sans-serif"
        }}>
            <AmbientBackground />

            {/* Nav */}
            <FloatingPillNav 
                onLogoClick={() => navigate('/')}
                rightSlot={
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <Link to="/register" style={{ 
                            padding: '0.45rem 1.1rem', borderRadius: 999, fontSize: '0.825rem', fontWeight: 600,
                            color: '#737373', textDecoration: 'none', transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.color = '#0a0a0a'}
                        onMouseOut={e => e.currentTarget.style.color = '#737373'}
                        >Sign up</Link>
                    </div>
                }
            />

            <main style={{ 
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                zIndex: 10, padding: '7rem 1.5rem 2rem' 
            }}>
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    style={{ width: '100%', maxWidth: 440 }}
                >
                    <motion.div
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                        style={{ 
                            rotateX, rotateY, transformStyle: "preserve-3d",
                            perspective: "1000px"
                        }}
                    >
                        <div style={{ 
                            background: '#ffffff',
                            borderRadius: 32,
                            padding: '3rem 2.5rem',
                            border: '1px solid rgba(0,0,0,0.06)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            {/* Subtle Top Glow */}
                            <div style={{
                                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                                background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.2), transparent)'
                            }} />

                            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    style={{ 
                                        width: 48, height: 48, 
                                        background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                                        borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 1.5rem',
                                        boxShadow: '0 8px 16px rgba(37,99,235,0.2)'
                                    }}
                                >
                                    <Zap size={24} color="white" fill="white" />
                                </motion.div>
                                <h1 style={{ 
                                    fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.04em',
                                    color: '#0a0a0a', marginBottom: '0.5rem' 
                                }}>
                                    Welcome back
                                </h1>
                                <p style={{ color: '#737373', fontSize: '1rem', fontWeight: 500 }}>
                                    Sign in to your HireSnap account
                                </p>
                            </div>

                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    style={{ 
                                        padding: '0.8rem 1rem', borderRadius: 12, background: '#fff1f2', 
                                        border: '1px solid #ffe4e6', color: '#e11d48', 
                                        fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 500,
                                        display: 'flex', alignItems: 'center', gap: '8px'
                                    }}
                                >
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#e11d48' }} />
                                    {error}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.01, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                                whileTap={{ scale: 0.99 }}
                                style={{
                                    width: '100%', padding: '0.85rem', borderRadius: 14,
                                    border: '1px solid rgba(0,0,0,0.08)', background: '#ffffff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    gap: '12px', fontSize: '0.95rem', fontWeight: 600, color: '#0a0a0a',
                                    cursor: 'pointer', transition: 'all 0.2s', marginBottom: '1.5rem'
                                }}
                            >
                                <Chrome size={18} />
                                Sign in with Google
                            </motion.button>

                            <div style={{ 
                                display: 'flex', alignItems: 'center', gap: '1rem', 
                                marginBottom: '1.5rem'
                            }}>
                                <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
                                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or email</span>
                                <div style={{ flex: 1, height: '1px', background: '#f0f0f0' }} />
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: 600, color: '#404040' }}>Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            required
                                            style={{
                                                width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: 14,
                                                border: '1px solid #e5e5e5', background: '#fafafa',
                                                fontSize: '1rem', color: '#0a0a0a', outline: 'none',
                                                transition: 'all 0.2s',
                                            }}
                                            onFocus={e => { 
                                                e.target.style.borderColor = '#0a0a0a'; 
                                                e.target.style.background = '#ffffff';
                                                e.target.parentElement.style.transform = 'translateY(-2px)';
                                            }}
                                            onBlur={e => { 
                                                e.target.style.borderColor = '#e5e5e5'; 
                                                e.target.style.background = '#fafafa';
                                                e.target.parentElement.style.transform = 'translateY(0)';
                                            }}
                                        />
                                        <Mail size={18} color="#a3a3a3" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    </div>
                                </div>

                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#404040' }}>Password</label>
                                        <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}>Forgot?</Link>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            required
                                            style={{
                                                width: '100%', padding: '0.85rem 1rem 0.85rem 2.8rem', borderRadius: 14,
                                                border: '1px solid #e5e5e5', background: '#fafafa',
                                                fontSize: '1rem', color: '#0a0a0a', outline: 'none',
                                                transition: 'all 0.2s',
                                            }}
                                            onFocus={e => { 
                                                e.target.style.borderColor = '#0a0a0a'; 
                                                e.target.style.background = '#ffffff';
                                                e.target.parentElement.style.transform = 'translateY(-2px)';
                                            }}
                                            onBlur={e => { 
                                                e.target.style.borderColor = '#e5e5e5'; 
                                                e.target.style.background = '#fafafa';
                                                e.target.parentElement.style.transform = 'translateY(0)';
                                            }}
                                        />
                                        <Lock size={18} color="#a3a3a3" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    </div>
                                </div>

                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.01, background: '#0a0a0a' }}
                                    whileTap={{ scale: 0.99 }}
                                    disabled={loading}
                                    style={{
                                        width: '100%', padding: '1rem', borderRadius: 14,
                                        background: '#171717', color: 'white',
                                        fontSize: '1rem', fontWeight: 600, border: 'none',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                        marginTop: '0.5rem'
                                    }}
                                >
                                    {loading ? 'Signing in...' : 'Sign in'}
                                    {!loading && <ArrowRight size={18} />}
                                </motion.button>
                            </form>

                            <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#737373', fontSize: '0.9rem' }}>
                                New to HireSnap? <Link to="/register" style={{ color: '#0a0a0a', fontWeight: 700, textDecoration: 'none' }}>Create an account</Link>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </main>

            <footer style={{ 
                padding: '2rem', textAlign: 'center', color: '#a3a3a3', 
                fontSize: '0.75rem', zIndex: 10, letterSpacing: '0.02em' 
            }}>
                &copy; 2024 HireSnap. All rights reserved.
            </footer>
        </div>
    );
};

export default Login;
