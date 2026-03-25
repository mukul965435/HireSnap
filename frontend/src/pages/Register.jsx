import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, Sparkles, Monitor } from 'lucide-react';
import FloatingPillNav from '../components/FloatingPillNav';

const AmbientBackground = () => (
    <div style={{
        position: 'absolute', inset: 0,
        overflow: 'hidden', pointerEvents: 'none', zIndex: 0
    }}>
        {/* Soft Glows */}
        <motion.div 
            animate={{ 
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.6, 0.3],
                x: [0, -40, 0],
                y: [0, 50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            style={{
                position: 'absolute', top: '-15%', right: '5%',
                width: '65vw', height: '65vw',
                background: 'radial-gradient(circle, rgba(59, 130, 246, 0.07) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(100px)'
            }}
        />
        <motion.div 
            animate={{ 
                scale: [1.3, 1, 1.3],
                opacity: [0.2, 0.4, 0.2],
                x: [0, 60, 0],
                y: [0, -30, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
            style={{
                position: 'absolute', bottom: '-20%', left: '5%',
                width: '55vw', height: '55vw',
                background: 'radial-gradient(circle, rgba(139, 92, 246, 0.07) 0%, transparent 70%)',
                borderRadius: '50%', filter: 'blur(100px)'
            }}
        />
        
        {/* Micro-grid pattern */}
        <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.03) 1px, transparent 0)',
            backgroundSize: '40px 40px',
            opacity: 0.5
        }} />
    </div>
);

const Register = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    // Mouse movement for card tilt
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["3deg", "-3deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-3deg", "3deg"]);

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
            await register(fullName, email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to register');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#ffffff',
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
                        <Link to="/login" style={{ 
                            padding: '0.45rem 1.1rem', borderRadius: 999, fontSize: '0.825rem', fontWeight: 600,
                            color: '#737373', textDecoration: 'none', transition: 'all 0.2s'
                        }}
                        onMouseOver={e => e.currentTarget.style.color = '#0a0a0a'}
                        onMouseOut={e => e.currentTarget.style.color = '#737373'}
                        >Sign in</Link>
                    </div>
                }
            />

            <main style={{ 
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                zIndex: 10, padding: '7rem 1.5rem 3rem' 
            }}>
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                    style={{ width: '100%', maxWidth: 460 }}
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
                            borderRadius: 36,
                            padding: '3.5rem 2.8rem',
                            border: '1px solid rgba(0,0,0,0.06)',
                            boxShadow: '0 25px 60px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.02)',
                            position: 'relative'
                        }}>
                             <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                                <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    style={{ 
                                        width: 52, height: 52, 
                                        background: 'linear-gradient(135deg,#7c3aed,#2563eb)',
                                        borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 1.5rem',
                                        boxShadow: '0 10px 20px rgba(124,58,237,0.2)'
                                    }}
                                >
                                    <Sparkles size={26} color="white" fill="white" />
                                </motion.div>
                                <h1 style={{ 
                                    fontSize: '2.4rem', fontWeight: 800, letterSpacing: '-0.04em',
                                    color: '#0a0a0a', marginBottom: '0.6rem' 
                                }}>
                                    Join HireSnap
                                </h1>
                                <p style={{ color: '#737373', fontSize: '1.05rem', fontWeight: 500 }}>
                                    Land your dream job with AI-powered insights
                                </p>
                            </div>

                            <div style={{ background: 'transparent' }}>
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        style={{ 
                                            padding: '1rem', borderRadius: 14, background: '#fef2f2', 
                                            border: '1px solid #fee2e2', color: '#ef4444', 
                                            fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 500 
                                        }}
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                {/* Google Auth - UI Mockup */}
                                <motion.button
                                    whileHover={{ scale: 1.01, background: '#f9f9f9' }}
                                    whileTap={{ scale: 0.99 }}
                                    style={{
                                        width: '100%', padding: '0.85rem', borderRadius: 14,
                                        border: '1px solid rgba(0,0,0,0.08)', background: '#ffffff',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: '12px', fontSize: '0.95rem', fontWeight: 600, color: '#0a0a0a',
                                        cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                                        transition: 'all 0.2s', marginBottom: '1.5rem'
                                    }}
                                >
                                    <Monitor size={18} color="#4285F4" />
                                    Sign up with Google
                                </motion.button>

                                <div style={{ 
                                    display: 'flex', alignItems: 'center', gap: '1rem', 
                                    marginBottom: '1.5rem', color: '#f0f0f0' 
                                }}>
                                    <div style={{ flex: 1, height: '1px', background: 'currentColor' }} />
                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#a3a3a3', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Create account</span>
                                    <div style={{ flex: 1, height: '1px', background: 'currentColor' }} />
                                </div>

                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.875rem', fontWeight: 600, color: '#404040' }}>Full Name</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="John Doe"
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
                                            <User size={18} color="#a3a3a3" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.875rem', fontWeight: 600, color: '#404040' }}>Email</label>
                                        <div style={{ position: 'relative' }}>
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="you@company.com"
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
                                        <label style={{ display: 'block', marginBottom: '0.6rem', fontSize: '0.875rem', fontWeight: 600, color: '#404040' }}>Password</label>
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
                                            boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                                            marginTop: '0.5rem'
                                        }}
                                    >
                                        {loading ? 'Creating account...' : 'Create account'}
                                        {!loading && <ArrowRight size={18} />}
                                    </motion.button>
                                </form>

                                <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#737373', fontSize: '0.9rem' }}>
                                    Already have an account? <Link to="/login" style={{ color: '#0a0a0a', fontWeight: 700, textDecoration: 'none' }}>Sign in here</Link>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </main>

            <footer style={{ 
                padding: '2.5rem', textAlign: 'center', color: '#a3a3a3', 
                fontSize: '0.75rem', zIndex: 10, letterSpacing: '0.02em' 
            }}>
                &copy; 2024 HireSnap. Built for the modern job seeker.
            </footer>
        </div>
    );
};

export default Register;
