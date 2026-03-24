import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    User, Mail, Camera, FileText, CheckCircle2, TrendingUp, 
    Briefcase, Calendar, ChevronRight, Lock, Save, Edit2, Clock, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { useNavigate } from 'react-router-dom';

const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'https://hiresnap.onrender.com';

/* ─── Animation variants ─────────────────────────────────────── */
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] } }
};

const Profile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const fileInputRef = React.useRef(null);
    
    // Form states
    const [formData, setFormData] = useState({
        fullName: user?.fullName || '',
        bio: 'Passionate software developer looking to bridge the gap between AI and human recruitment.',
        email: user?.email || ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/resumes');
                // The backend returns { success: true, data: [...] }
                setResumes(response.data?.data || []);
            } catch (err) {
                console.error("Error fetching resumes:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const stats = {
        totalResumes: resumes.length,
        bestScore: resumes.length > 0 ? Math.max(...resumes.map(r => r.atsScore || 0)) : 0,
        avgScore: resumes.length > 0 ? Math.round(resumes.reduce((acc, r) => acc + (r.atsScore || 0), 0) / resumes.length) : 0,
        jobsMatched: 42 // Mocked
    };

    const allSkills = Array.from(new Set(
        (Array.isArray(resumes) ? resumes : []).flatMap(r => r.parsedData?.skills || [])
    )).slice(0, 15);

    const handleSave = async () => {
        try {
            const res = await api.put('/users/profile', {
                fullName: formData.fullName,
                bio: formData.bio
            });
            if (res.data?.success) {
                updateUser(res.data.user);
                setEditing(false);
            }
        } catch (err) {
            console.error("Error updating profile:", err);
            setEditing(false);
        }
    };

    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        try {
            setUploadingAvatar(true);
            const res = await api.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (res.data?.success) {
                updateUser(res.data.user);
            }
        } catch (err) {
            console.error("Error uploading avatar:", err);
        } finally {
            setUploadingAvatar(false);
        }
    };

    return (
        <motion.div initial="hidden" animate="show" variants={container} style={{ paddingBottom: '4rem' }}>
            
            {/* Header Section */}
            <motion.div variants={item} style={{ 
                background: 'white', borderRadius: 24, padding: '2.5rem', 
                border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 8px 32px rgba(0,0,0,0.02)',
                display: 'flex', alignItems: 'center', gap: '2.5rem', marginBottom: '2rem',
                position: 'relative', overflow: 'hidden'
            }}>
                <div style={{ position: 'relative' }}>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleAvatarChange} 
                        style={{ display: 'none' }} 
                        accept="image/*" 
                    />
                    <div style={{ 
                        width: 120, height: 120, borderRadius: '50%', 
                        background: user?.avatar ? 'none' : 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 12px 24px rgba(37, 99, 235, 0.3)',
                        overflow: 'hidden',
                        position: 'relative',
                        border: user?.avatar ? '4px solid white' : 'none'
                    }}>
                        {user?.avatar ? (
                            <img 
                                src={`${BACKEND_URL}${user.avatar}`} 
                                alt="Profile" 
                                crossOrigin="anonymous"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            <User size={60} color="white" />
                        )}
                        {uploadingAvatar && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Clock size={24} className="animate-spin text-blue-600" />
                            </div>
                        )}
                    </div>
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAvatarClick}
                        style={{
                            position: 'absolute', bottom: 0, right: 0,
                            width: 36, height: 36, borderRadius: '50%', background: 'white',
                            border: '1px solid #e5e5e5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            zIndex: 10
                        }}
                    >
                        <Camera size={18} color="#0a0a0a" />
                    </motion.button>
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '0.75rem' }}>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em' }}>{formData.fullName}</h1>
                        <span style={{ 
                            background: '#dcfce7', color: '#16a34a', padding: '0.35rem 0.85rem', 
                            borderRadius: 99, fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase'
                        }}>PRO VERSION</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: '#737373', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                            <Mail size={16} /> {formData.email}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                            <Calendar size={16} /> Joined Feb 2024
                        </div>
                    </div>
                    {editing ? (
                        <textarea 
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                            style={{ 
                                width: '100%', padding: '0.75rem', borderRadius: 12, border: '1px solid #e5e5e5',
                                background: '#f9fafb', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'none'
                            }}
                            rows={2}
                        />
                    ) : (
                        <p style={{ color: '#525252', fontSize: '1.05rem', lineHeight: 1.6, maxWidth: '600px' }}>
                            {formData.bio}
                        </p>
                    )}
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {editing ? (
                        <motion.button 
                            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={handleSave}
                            style={{ 
                                padding: '0.75rem 1.75rem', borderRadius: 14, background: '#0a0a0a', 
                                color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <Save size={18} /> Save Changes
                        </motion.button>
                    ) : (
                        <motion.button 
                            whileHover={{ scale: 1.02, background: 'rgba(0,0,0,0.05)' }} whileTap={{ scale: 0.98 }}
                            onClick={() => setEditing(true)}
                            style={{ 
                                padding: '0.75rem 1.75rem', borderRadius: 14, background: 'transparent', 
                                border: '1px solid #e5e5e5', color: '#0a0a0a', fontWeight: 600, cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem'
                            }}
                        >
                            <Edit2 size={18} /> Edit Profile
                        </motion.button>
                    )}
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Total Resumes', value: stats.totalResumes, icon: FileText, color: '#2563eb' },
                    { label: 'Best Score', value: `${stats.bestScore}%`, icon: CheckCircle2, color: '#16a34a' },
                    { label: 'Avg ATS Score', value: `${stats.avgScore}%`, icon: TrendingUp, color: '#7c3aed' },
                    { label: 'Jobs Matched', value: stats.jobsMatched, icon: Briefcase, color: '#ea580c' }
                ].map((s, idx) => (
                    <motion.div variants={item} key={idx} whileHover={{ y: -5 }} style={{ 
                        background: 'white', borderRadius: 20, padding: '1.5rem', 
                        border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 4px 12px rgba(0,0,0,0.01)'
                    }}>
                        <div style={{ 
                            width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem'
                        }}>
                            <s.icon size={22} color={s.color} />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
                            {s.value}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#737373', fontWeight: 500 }}>{s.label}</div>
                    </motion.div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: '2rem' }}>
                {/* Left Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Resume History */}
                    <motion.div variants={item} style={{ background: 'white', borderRadius: 24, padding: '2rem', border: '1px solid rgba(0,0,0,0.06)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0a0a0a' }}>Resume History</h2>
                            <button onClick={() => navigate('/resumes')} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                View All <ChevronRight size={16} />
                            </button>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {loading ? (
                                <p>Loading history...</p>
                            ) : resumes.length > 0 ? (
                                resumes.slice(0, 4).map((r, i) => (
                                    <div key={i} style={{ 
                                        display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', 
                                        borderRadius: 16, background: '#fafafa', border: '1px solid #f0f0f0' 
                                    }}>
                                        <div style={{ width: 44, height: 44, borderRadius: 12, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #eee' }}>
                                            <FileText size={20} color="#737373" />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#171717', marginBottom: '0.2rem' }}>{r.filename}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#a3a3a3' }}>Uploaded on {new Date(r.createdAt).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ textAlign: 'right', marginRight: '1rem' }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: r.atsScore >= 70 ? '#16a34a' : '#d97706' }}>{r.atsScore}%</div>
                                            <div style={{ fontSize: '0.7rem', color: '#a3a3a3', fontWeight: 600 }}>ATS SCORE</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button 
                                                onClick={() => navigate(`/resumes/${r._id}`)}
                                                style={{ padding: '0.5rem 1rem', borderRadius: 10, background: 'white', border: '1px solid #e5e5e5', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                                            >
                                                View
                                            </button>
                                            <button 
                                                onClick={() => navigate('/compare')}
                                                style={{ padding: '0.5rem 1rem', borderRadius: 10, background: '#0a0a0a', color: 'white', border: 'none', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                                            >
                                                Compare
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ textAlign: 'center', color: '#737373', padding: '2rem' }}>No resumes uploaded yet.</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Account Settings */}
                    <motion.div variants={item} style={{ background: 'white', borderRadius: 24, padding: '2rem', border: '1px solid rgba(0,0,0,0.06)' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0a0a0a', marginBottom: '1.75rem' }}>Account Settings</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#171717' }}>Change Password</h3>
                                <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <input type="password" name="currentPassword" placeholder="Current Password" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 12, border: '1px solid #e5e5e5', fontSize: '0.9rem', background: '#fafafa' }} />
                                        <Lock size={16} color="#a3a3a3" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <input type="password" name="newPassword" placeholder="New Password" style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 12, border: '1px solid #e5e5e5', fontSize: '0.9rem', background: '#fafafa' }} />
                                        <Lock size={16} color="#a3a3a3" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)' }} />
                                    </div>
                                    <button type="submit" style={{ padding: '0.75rem', borderRadius: 12, background: '#0a0a0a', color: 'white', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Update Password</button>
                                </form>
                            </div>
                            <div>
                                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: '#171717' }}>Notification Settings</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {['Job Match Alerts', 'Resume Scan Completed', 'AI Tips & Insights'].map((opt, i) => (
                                        <label key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                                            <span style={{ fontSize: '0.9rem', color: '#525252' }}>{opt}</span>
                                            <div style={{ width: 44, height: 24, borderRadius: 99, background: i === 2 ? '#e5e5e5' : '#0a0a0a', position: 'relative' }}>
                                                <div style={{ position: 'absolute', top: 3, left: i === 2 ? 3 : 23, width: 18, height: 18, borderRadius: '50%', background: 'white', transition: 'all 0.2s' }} />
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    {/* Skills Section */}
                    <motion.div variants={item} style={{ background: 'white', borderRadius: 24, padding: '2rem', border: '1px solid rgba(0,0,0,0.06)' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0a0a0a', marginBottom: '1.5rem' }}>Top Skills</h2>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                            {allSkills.length > 0 ? allSkills.map((skill, i) => (
                                <span key={i} style={{ 
                                    padding: '0.5rem 1rem', borderRadius: 99, background: '#f5f5f5', 
                                    color: '#525252', fontSize: '0.85rem', fontWeight: 600, border: '1px solid #eee'
                                }}>
                                    {skill}
                                </span>
                            )) : (
                                <p style={{ fontSize: '0.9rem', color: '#a3a3a3' }}>Upload resumes to see extracted skills.</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Activity Timeline */}
                    <motion.div variants={item} style={{ background: 'white', borderRadius: 24, padding: '2rem', border: '1px solid rgba(0,0,0,0.06)' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0a0a0a', marginBottom: '1.75rem' }}>Activity Timeline</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                            {/* Vertical Line */}
                            <div style={{ position: 'absolute', left: '10px', top: '5px', bottom: '5px', width: '2px', background: '#f0f0f0' }} />
                            
                            {[
                                { action: 'Resume Uploaded', detail: 'Senior Frontend Dev CV', date: 'Just now', icon: FileText, color: '#2563eb' },
                                { action: 'New Job Match', detail: 'Google - Software Engineer', date: '2 hours ago', icon: Briefcase, color: '#16a34a' },
                                { action: 'ATS Scan Completed', detail: 'Score improved by 12%', date: 'Yesterday', icon: TrendingUp, color: '#7c3aed' },
                                { action: 'Account Created', detail: 'Welcome to HireSnap!', date: 'Feb 15, 2024', icon: Sparkles, color: '#ea580c' }
                            ].map((act, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
                                    <div style={{ 
                                        width: 22, height: 22, borderRadius: '50%', background: 'white', 
                                        border: `2px solid ${act.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: act.color }} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#171717' }}>{act.action}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#737373', marginBottom: '0.2rem' }}>{act.detail}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#a3a3a3', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <Clock size={12} /> {act.date}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Profile;
