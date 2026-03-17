import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/Common';
import { LogIn, Github } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at top right, rgba(59, 130, 246, 0.1), transparent), radial-gradient(circle at bottom left, rgba(45, 212, 191, 0.1), transparent)'
        }}>
            <div style={{ width: '100%', maxWidth: '400px', padding: '1rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Hire<span className="gradient-text">Snap</span></h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to optimize your career</p>
                </div>

                <Card>
                    {error && <div style={{ color: 'var(--danger-color)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <label style={{ fontSize: '0.875rem' }}>Password</label>
                                <Link to="/forgot-password" style={{ fontSize: '0.75rem', color: 'var(--accent-color)' }}>Forgot?</Link>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button type="submit" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div style={{ margin: '1.5rem 0', textAlign: 'center', position: 'relative' }}>
                        <hr style={{ border: '0', borderTop: '1px solid var(--border-color)' }} />
                        <span style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            background: 'var(--panel-color)',
                            padding: '0 0.5rem',
                            fontSize: '0.75rem',
                            color: 'var(--text-secondary)'
                        }}>OR CONTINUE WITH</span>
                    </div>

                    <Button variant="secondary" style={{ width: '100%', marginBottom: '1rem' }}>
                        <Github size={18} /> GitHub
                    </Button>

                    <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Don't have an account? <Link to="/register" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Sign up</Link>
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default Login;
