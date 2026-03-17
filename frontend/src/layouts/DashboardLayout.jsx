import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, FileText, Briefcase, LogOut,
    Search, GitCompare, Sun, Moon, Zap, ChevronDown, User
} from 'lucide-react';

const NAV_ITEMS = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/resumes', icon: FileText, label: 'Resumes' },
    { to: '/compare', icon: GitCompare, label: 'Compare' },
    { to: '/jobs', icon: Briefcase, label: 'Job Search' },
    { to: '/analyze', icon: Search, label: 'AI Analyzer' },
];

const TopNav = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [theme, setTheme] = useState(() => localStorage.getItem('hs-theme') || 'light');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        localStorage.setItem('hs-theme', next);
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        /* Transparent wrapper — centers the pill */
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
            display: 'flex', justifyContent: 'center',
            padding: '0.9rem 2rem',
            pointerEvents: 'none',
        }}>
            <motion.header
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                style={{
                    pointerEvents: 'all',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    padding: '0.4rem 0.4rem 0.4rem 1rem',
                    background: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    borderRadius: 999,
                    border: '1px solid rgba(0,0,0,0.09)',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
                    width: 'fit-content',
                    maxWidth: 900,
                }}
            >
                {/* Logo */}
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', marginRight: '0.5rem', flexShrink: 0 }}
                    onClick={() => navigate('/dashboard')}
                >
                    <div style={{
                        width: 27, height: 27,
                        background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                        borderRadius: 8,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Zap size={13} color="white" fill="white" />
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '-0.03em', color: '#0a0a0a', whiteSpace: 'nowrap' }}>
                        HireSnap
                    </span>
                </div>

                {/* Thin divider */}
                <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.1)', marginRight: '0.35rem', flexShrink: 0 }} />

                {/* Nav pills */}
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.to === '/dashboard'}
                        style={({ isActive }) => ({
                            display: 'flex', alignItems: 'center', gap: '0.35rem',
                            padding: '0.45rem 0.75rem',
                            borderRadius: 999,
                            fontSize: '0.825rem',
                            fontWeight: isActive ? 600 : 500,
                            color: isActive ? '#0a0a0a' : '#737373',
                            background: isActive ? 'rgba(0,0,0,0.07)' : 'transparent',
                            transition: 'all 0.15s',
                            textDecoration: 'none',
                            whiteSpace: 'nowrap',
                        })}
                        onMouseOver={e => { if (!e.currentTarget.classList.contains('active')) { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#0a0a0a'; } }}
                        onMouseOut={e => { if (!e.currentTarget.classList.contains('active')) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#737373'; } }}
                    >
                        <item.icon size={14} />
                        {item.label}
                    </NavLink>
                ))}

                {/* Right controls */}
                <div style={{ marginLeft: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
                    {/* Theme toggle */}
                    <motion.button
                        whileHover={{ scale: 1.08, background: 'rgba(0,0,0,0.07)' }}
                        whileTap={{ scale: 0.93 }}
                        onClick={toggleTheme}
                        style={{
                            width: 32, height: 32, borderRadius: 999,
                            background: 'rgba(0,0,0,0.04)',
                            border: '1px solid rgba(0,0,0,0.07)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: '#737373',
                        }}
                        title={theme === 'light' ? 'Dark mode' : 'Light mode'}
                    >
                        {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
                    </motion.button>

                    {/* Avatar + Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <motion.button
                            whileHover={{ background: 'rgba(0,0,0,0.05)' }}
                            onClick={() => setDropdownOpen(p => !p)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                padding: '0.3rem 0.6rem 0.3rem 0.3rem',
                                borderRadius: 999,
                                border: '1px solid rgba(0,0,0,0.08)',
                                background: 'rgba(255,255,255,0.7)',
                                cursor: 'pointer',
                                transition: 'background 0.15s',
                            }}
                        >
                            <div style={{
                                width: 26, height: 26, borderRadius: '50%',
                                background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                            }}>
                                <User size={13} color="white" />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0a0a0a', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {user?.name || user?.email?.split('@')[0] || 'Account'}
                            </span>
                            <ChevronDown size={12} color="#a3a3a3" />
                        </motion.button>

                        {/* Dropdown menu */}
                        <AnimatePresence>
                            {dropdownOpen && (
                                <>
                                    {/* Backdrop */}
                                    <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => setDropdownOpen(false)} />

                                    <motion.div
                                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: -6, scale: 0.95 }}
                                        transition={{ duration: 0.18 }}
                                        style={{
                                            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                                            background: 'white', borderRadius: 16,
                                            border: '1px solid rgba(0,0,0,0.08)',
                                            boxShadow: '0 16px 48px rgba(0,0,0,0.14)',
                                            padding: '0.5rem',
                                            minWidth: 200, zIndex: 200,
                                        }}
                                    >
                                        {/* User info */}
                                        <div style={{ padding: '0.65rem 0.75rem 0.6rem', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '0.3rem' }}>
                                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0a0a0a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {user?.name || 'User'}
                                            </div>
                                            <div style={{ fontSize: '0.72rem', color: '#a3a3a3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: 1 }}>
                                                {user?.email}
                                            </div>
                                        </div>

                                        {/* Logout */}
                                        <button
                                            onClick={handleLogout}
                                            style={{
                                                width: '100%', display: 'flex', alignItems: 'center', gap: '0.55rem',
                                                padding: '0.6rem 0.75rem', borderRadius: 10,
                                                background: 'transparent', color: '#ef4444',
                                                fontSize: '0.82rem', fontWeight: 600,
                                                cursor: 'pointer', border: 'none',
                                                transition: 'background 0.15s',
                                            }}
                                            onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                                        >
                                            <LogOut size={14} /> Sign out
                                        </button>
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.header>
        </div>
    );
};

const pageVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
};

const DashboardLayout = ({ children }) => {
    return (
        <div style={{ background: '#f2f2f2', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <TopNav />
            <main style={{
                maxWidth: 1200,
                margin: '0 auto',
                padding: '5rem 2.5rem 3rem', // top padding clears the floating pill
            }}>
                <motion.div
                    variants={pageVariants}
                    initial="initial"
                    animate="animate"
                >
                    {children}
                </motion.div>
            </main>
        </div>
    );
};

export default DashboardLayout;
