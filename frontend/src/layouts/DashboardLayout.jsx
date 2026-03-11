import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FileText, Briefcase, User, LogOut, Search, GitCompare } from 'lucide-react';

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
            <div className="logo" style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                marginBottom: '2.5rem',
                paddingLeft: '1rem',
                fontFamily: 'Outfit'
            }}>
                Hire<span className="gradient-text">Snap</span>
            </div>

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
                                    color: isActive ? 'white' : 'var(--text-secondary)',
                                    background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                                    transition: 'var(--transition-smooth)'
                                })}
                            >
                                <item.icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <div style={{ marginTop: 'auto' }}>
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
                        textAlign: 'left'
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
