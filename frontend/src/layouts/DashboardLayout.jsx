import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LayoutDashboard, FileText, Briefcase, LogOut, Search, GitCompare, Moon, Sun } from 'lucide-react';

const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <div className="theme-toggle-wrapper">
            {/* Icon on the left */}
            <div style={{
                width: 20,
                height: 20,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: isDark ? '#94a3b8' : '#f59e0b',
                transition: 'color 0.3s ease'
            }}>
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </div>

            <span className="theme-toggle-label">
                {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>

            {/* Pill Toggle */}
            <button
                className="theme-toggle"
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
            >
                <div className="theme-toggle__thumb">
                    {isDark ? '🌙' : '☀️'}
                </div>
            </button>
        </div>
    );
};

const Sidebar = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="sidebar glass" style={{
            width: '260px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '1px solid var(--border-color)'
        }}>
            {/* Logo */}
            <div className="logo" style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                marginBottom: '2.5rem',
                paddingLeft: '1rem',
                fontFamily: 'Outfit'
            }}>
                Hire<span className="gradient-text">Snap</span>
            </div>

            {/* Nav Links */}
            <nav style={{ flex: 1 }}>
                <ul style={{ listStyle: 'none' }}>
                    {[
                        { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
                        { to: '/resumes', icon: FileText, label: 'Resumes' },
                        { to: '/compare', icon: GitCompare, label: 'Compare' },
                        { to: '/jobs', icon: Briefcase, label: 'Job Search' },
                        { to: '/analyze', icon: Search, label: 'AI Analyzer' },
                    ].map((item) => (
                        <li key={item.to} style={{ marginBottom: '0.5rem' }}>
                            <NavLink
                                to={item.to}
                                style={({ isActive }) => ({
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '10px',
                                    color: isActive ? 'var(--nav-active-color)' : 'var(--text-secondary)',
                                    background: isActive ? 'var(--nav-active-bg)' : 'transparent',
                                    fontWeight: isActive ? 600 : 400,
                                    transition: 'all 0.2s ease'
                                })}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Bottom section */}
            <div style={{ marginTop: 'auto' }}>
                {/* ─── Theme Toggle ─── */}
                <ThemeToggle />

                {/* Divider */}
                <div style={{
                    height: '1px',
                    background: 'var(--border-color)',
                    margin: '0.5rem 0.5rem 0.75rem'
                }} />

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        borderRadius: '10px',
                        color: 'var(--danger-color)',
                        background: 'transparent',
                        textAlign: 'left',
                        fontSize: '0.9rem'
                    }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

const DashboardLayout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                marginLeft: '260px',
                padding: '2rem 3rem',
                maxWidth: 'calc(100vw - 260px)'
            }}>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
