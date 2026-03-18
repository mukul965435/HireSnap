import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, FileText, Briefcase, LogOut, Search, GitCompare, Sun, Moon, ChevronDown, User } from 'lucide-react';
import FloatingPillNav from '../components/FloatingPillNav';

const NAV_ITEMS = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/resumes',   icon: FileText,        label: 'Resumes'   },
    { to: '/compare',   icon: GitCompare,      label: 'Compare'   },
    { to: '/jobs',      icon: Briefcase,       label: 'Job Search'},
    { to: '/analyze',   icon: Search,          label: 'AI Analyzer'},
];

/* ─── pill-style hover helper ──────────────────────────────────── */
const pillHover = {
    onMouseOver: e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = '#0a0a0a'; },
    onMouseOut:  e => { e.currentTarget.style.background = 'transparent';       e.currentTarget.style.color = '#737373'; },
};

const TopNav = () => {
    const { user, logout } = useAuth();
    const navigate            = useNavigate();
    const [theme, setTheme]   = useState(() => localStorage.getItem('hs-theme') || 'light');
    const [open, setOpen]     = useState(false);

    const toggleTheme = () => {
        const next = theme === 'light' ? 'dark' : 'light';
        setTheme(next);
        localStorage.setItem('hs-theme', next);
    };

    const handleLogout = async () => { await logout(); navigate('/'); };

    const leftSlot = (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {NAV_ITEMS.map(item => (
                <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/dashboard'}
                    style={({ isActive }) => ({
                        display: 'flex', alignItems: 'center', gap: '0.35rem',
                        padding: '0.45rem 0.75rem', borderRadius: 999,
                        fontSize: '0.825rem', fontWeight: isActive ? 600 : 500,
                        color: isActive ? '#0a0a0a' : '#737373',
                        background: isActive ? 'rgba(0,0,0,0.07)' : 'transparent',
                        transition: 'all 0.15s', textDecoration: 'none', whiteSpace: 'nowrap',
                    })}
                >
                    <item.icon size={14} />
                    {item.label}
                </NavLink>
            ))}
        </div>
    );

    const rightSlot = (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Avatar */}
            <div style={{ position: 'relative' }}>
                <motion.button
                    whileHover={{ background: 'rgba(0,0,0,0.05)' }}
                    onClick={() => setOpen(p => !p)}
                    style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.28rem 0.55rem 0.28rem 0.28rem', borderRadius: 999, border: '1px solid rgba(0,0,0,0.08)', background: 'rgba(255,255,255,0.7)', cursor: 'pointer', transition: 'background 0.15s' }}
                >
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={13} color="white" />
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0a0a0a', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {user?.fullName || 'Account'}
                    </span>
                    <ChevronDown size={12} color="#a3a3a3" />
                </motion.button>

                {open && (
                    <>
                        <div style={{ position: 'fixed', inset: 0, zIndex: 150 }} onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.16 }}
                            style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)', boxShadow: '0 16px 48px rgba(0,0,0,0.14)', padding: '0.5rem', minWidth: 200, zIndex: 200 }}
                        >
                            <div style={{ padding: '0.6rem 0.75rem 0.55rem', borderBottom: '1px solid rgba(0,0,0,0.06)', marginBottom: '0.3rem' }}>
                                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0a0a0a' }}>{user?.fullName || 'User'}</div>
                                <div style={{ fontSize: '0.72rem', color: '#a3a3a3', marginTop: 1 }}>{user?.email}</div>
                            </div>
                            <button
                                onClick={() => { navigate('/profile'); setOpen(false); }}
                                style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: 10, border: 'none', background: 'transparent', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#404040', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
                                onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.color = '#0a0a0a'; }}
                                onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#404040'; }}
                            >
                                <User size={14} /> My Profile
                            </button>
                            <button
                                onClick={() => { logout(); setOpen(false); }}                              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.55rem', padding: '0.6rem 0.75rem', borderRadius: 10, background: 'transparent', color: '#ef4444', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', border: 'none', transition: 'background 0.15s' }}
                                onMouseOver={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <LogOut size={14} /> Sign out
                            </button>
                        </motion.div>
                    </>
                )}
            </div>
        </div>
    );

    return <FloatingPillNav leftSlot={leftSlot} rightSlot={rightSlot} onLogoClick={() => navigate('/dashboard')} />;
};

const pageVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] } },
};

const DashboardLayout = ({ children }) => (
    <div style={{ background: '#f2f2f2', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
        <TopNav />
        <main style={{ maxWidth: 1200, margin: '0 auto', padding: '5rem 2.5rem 3rem' }}>
            <motion.div variants={pageVariants} initial="initial" animate="animate">
                {children}
            </motion.div>
        </main>
    </div>
);

export default DashboardLayout;
