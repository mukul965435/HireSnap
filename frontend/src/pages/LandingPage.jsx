import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Zap, ArrowRight, CheckCircle, TrendingUp,
    FileText, Briefcase, Target,
    BarChart2, Award, Brain,
    LayoutDashboard, GitCompare, Search
} from 'lucide-react';
import FloatingPillNav from '../components/FloatingPillNav';

/* ─── Floating element styles ────────────────────────────────── */
const floatAnim = {
    y: [0, -14, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' }
};
const floatSlow = {
    y: [0, -10, 0],
    transition: { duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }
};
const floatFast = {
    y: [0, -8, 0],
    transition: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }
};

/* ─── Floating Cards ─────────────────────────────────────────── */
const AtsCard = () => (
    <motion.div animate={floatSlow} style={{
        background: 'white', borderRadius: 20, padding: '1rem 1.25rem',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)', width: 190,
        border: '1px solid rgba(0,0,0,0.06)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg,#2563eb,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BarChart2 size={16} color="white" />
            </div>
            <div>
                <div style={{ fontSize: '0.65rem', color: '#a3a3a3', fontWeight: 600 }}>ATS SCORE</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em' }}>89%</div>
            </div>
        </div>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            {['React', 'Node.js', 'Python'].map(s => (
                <span key={s} style={{ background: '#eff6ff', color: '#2563eb', borderRadius: 99, padding: '2px 8px', fontSize: '0.65rem', fontWeight: 600 }}>{s}</span>
            ))}
        </div>
        <div style={{ marginTop: '0.65rem', height: 4, background: '#f0f0f0', borderRadius: 99, overflow: 'hidden' }}>
            <motion.div
                initial={{ width: 0 }} animate={{ width: '89%' }} transition={{ duration: 1.5, delay: 0.5 }}
                style={{ height: '100%', background: 'linear-gradient(90deg,#2563eb,#7c3aed)', borderRadius: 99 }}
            />
        </div>
    </motion.div>
);

const JobMatchCard = () => (
    <motion.div animate={floatAnim} style={{
        background: 'white', borderRadius: 20, padding: '1rem 1.25rem',
        boxShadow: '0 12px 40px rgba(0,0,0,0.12)', width: 210,
        border: '1px solid rgba(0,0,0,0.06)'
    }}>
        <div style={{ fontSize: '0.65rem', color: '#a3a3a3', fontWeight: 600, marginBottom: '0.5rem' }}>NEW MATCH</div>
        <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0a0a0a', marginBottom: '0.25rem' }}>Senior Frontend Dev</div>
        <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, marginBottom: '0.65rem' }}>Google · Bangalore</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: 99, fontSize: '0.7rem', fontWeight: 700 }}>94% Match</span>
            <span style={{ fontSize: '0.7rem', color: '#a3a3a3' }}>just now</span>
        </div>
    </motion.div>
);

const SkillCard = () => (
    <motion.div animate={floatFast} style={{
        background: 'white', borderRadius: 16, padding: '0.85rem 1rem',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)', width: 170,
        border: '1px solid rgba(0,0,0,0.06)'
    }}>
        <div style={{ fontSize: '0.65rem', color: '#a3a3a3', fontWeight: 600, marginBottom: '0.4rem' }}>TOP SKILLS</div>
        {['JavaScript', 'MongoDB', 'Express'].map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 3 }}>
                <CheckCircle size={11} color="#16a34a" />
                <span style={{ fontSize: '0.75rem', color: '#0a0a0a', fontWeight: 500 }}>{s}</span>
            </div>
        ))}
    </motion.div>
);

const ResumeCard = () => (
    <motion.div animate={floatSlow} style={{
        background: 'white', borderRadius: 18, padding: '1rem',
        boxShadow: '0 12px 40px rgba(0,0,0,0.1)', width: 160,
        border: '1px solid rgba(0,0,0,0.06)'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ width: 28, height: 28, background: '#f0f4ff', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={14} color="#2563eb" />
            </div>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0a0a0a' }}>Resume.pdf</div>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
            <span style={{ background: '#fef9c3', color: '#a16207', padding: '2px 7px', borderRadius: 99, fontSize: '0.63rem', fontWeight: 600 }}>Analyzed</span>
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '2px 7px', borderRadius: 99, fontSize: '0.63rem', fontWeight: 600 }}>✓</span>
        </div>
    </motion.div>
);

/* ─── Navigation Items ───────────────────────────────────────── */

const LANDING_NAV_ITEMS = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/resumes',   icon: FileText,        label: 'Resumes'   },
    { to: '/compare',   icon: GitCompare,      label: 'Compare'   },
    { to: '/jobs',      icon: Briefcase,       label: 'Job Search'},
    { to: '/analyze',   icon: Search,          label: 'AI Analyzer'},
];

/* ─── Landing Navbar (uses shared pill shell) ────────────────── */
const Navbar = () => {
    const navigate = useNavigate();

    const leftSlot = (
        <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
            {LANDING_NAV_ITEMS.map(item => (
                <Link
                    key={item.label}
                    to={item.to}
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                        padding: '0.45rem 0.75rem', borderRadius: 999,
                        fontSize: '0.825rem', fontWeight: 500,
                        color: '#737373', textDecoration: 'none',
                        transition: 'background 0.15s, color 0.15s',
                        whiteSpace: 'nowrap',
                    }}
                    onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = '#0a0a0a'; }}
                    onMouseOut={e =>  { e.currentTarget.style.background = 'transparent';       e.currentTarget.style.color = '#737373';  }}
                >
                    <item.icon size={14} />
                    {item.label}
                </Link>
            ))}
        </div>
    );

    const rightSlot = (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Log in — ghost */}
            <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => navigate('/login')}
                style={{
                    background: 'transparent', border: 'none',
                    padding: '0.45rem 0.8rem', borderRadius: 999,
                    fontSize: '0.825rem', fontWeight: 600,
                    color: '#737373', cursor: 'pointer',
                    transition: 'background 0.15s, color 0.15s',
                    whiteSpace: 'nowrap',
                }}
                onMouseOver={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = '#0a0a0a'; }}
                onMouseOut={e =>  { e.currentTarget.style.background = 'transparent';       e.currentTarget.style.color = '#737373';  }}
            >
                Log in
            </motion.button>

            {/* Get started — dark pill */}
            <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 6px 20px rgba(0,0,0,0.22)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register')}
                style={{
                    background: '#0a0a0a', color: 'white',
                    padding: '0.45rem 1.1rem', borderRadius: 999,
                    fontSize: '0.825rem', fontWeight: 600,
                    border: 'none', cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
                    whiteSpace: 'nowrap',
                }}
            >
                Get started free
            </motion.button>
        </div>
    );

    return <FloatingPillNav leftSlot={leftSlot} rightSlot={rightSlot} onLogoClick={() => navigate('/')} />;
};


/* ─── Feature Card ───────────────────────────────────────────── */
const FeatureCard = ({ icon: Icon, title, desc, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5, delay }}
        whileHover={{ y: -6, boxShadow: '0 24px 60px rgba(0,0,0,0.1)' }}
        style={{
            background: 'white', borderRadius: 24, padding: '2rem',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
            transition: 'all 0.28s cubic-bezier(0.4,0,0.2,1)',
            cursor: 'default'
        }}
    >
        <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <Icon size={24} color={color} />
        </div>
        <h3 style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', marginBottom: '0.5rem', color: '#0a0a0a' }}>{title}</h3>
        <p style={{ color: '#737373', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
    </motion.div>
);

/* ─── Stat Item ──────────────────────────────────────────────── */
const StatItem = ({ value, label }) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', color: '#0a0a0a', lineHeight: 1 }}>{value}</div>
        <div style={{ color: '#737373', fontSize: '0.875rem', marginTop: '0.35rem', fontWeight: 500 }}>{label}</div>
    </div>
);

/* ─── Step ───────────────────────────────────────────────────── */
const Step = ({ num, title, desc, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 1.5rem' }}
    >
        <div style={{
            width: 52, height: 52, borderRadius: '50%',
            background: '#0a0a0a', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
        }}>{num}</div>
        <h4 style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '-0.02em', marginBottom: '0.5rem', color: '#0a0a0a' }}>{title}</h4>
        <p style={{ color: '#737373', fontSize: '0.875rem', lineHeight: 1.6, maxWidth: 240 }}>{desc}</p>
    </motion.div>
);

/* ─── Main Landing Page ──────────────────────────────────────── */
const LandingPage = () => {
    const navigate = useNavigate();

    const FEATURES = [
        { icon: BarChart2, title: 'ATS Score Analysis', desc: 'Get your resume scored against Applicant Tracking Systems used by top companies. Know exactly where you stand.', color: '#2563eb', delay: 0 },
        { icon: Brain, title: 'AI-Powered Suggestions', desc: 'Our AI reads your resume and suggests specific improvements to keywords, formatting, and skill presentation.', color: '#7c3aed', delay: 0.08 },
        { icon: Briefcase, title: 'Live Job Matching', desc: 'Instantly matched to real live jobs from Adzuna based on your resume skills. 40+ jobs updated daily.', color: '#16a34a', delay: 0.16 },
        { icon: Target, title: 'Skill Gap Finder', desc: 'Compare your skills against job requirements and discover exactly what skills to learn next to land the role.', color: '#d97706', delay: 0.24 },
        { icon: FileText, title: 'Resume Version Control', desc: 'Manage multiple resume versions. Keep track of every edit and compare before and after ATS improvements.', color: '#dc2626', delay: 0.32 },
        { icon: TrendingUp, title: 'Progress Tracker', desc: 'Watch your ATS score improve over time with an interactive chart. Celebrate every milestone.', color: '#0891b2', delay: 0.4 },
    ];

    const LOGOS = ['Google', 'Microsoft', 'Amazon', 'Meta', 'Flipkart', 'Swiggy', 'Razorpay', 'CRED'];

    return (
        <div style={{ background: '#f2f2f2', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
            <Navbar />

            {/* ─── HERO ────────────────────────────────────────────── */}
            <section style={{
                minHeight: '100vh',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
                paddingTop: '5rem',
                background: 'radial-gradient(ellipse 70% 60% at 50% 40%, rgba(255,255,255,0.9) 0%, transparent 100%), #f2f2f2'
            }}>
                {/* Floating elements */}
                <div style={{ position: 'absolute', left: '6%', top: '22%', zIndex: 2 }}>
                    <AtsCard />
                </div>
                <div style={{ position: 'absolute', left: '3%', bottom: '18%', zIndex: 2 }}>
                    <SkillCard />
                </div>
                <div style={{ position: 'absolute', right: '5%', top: '20%', zIndex: 2 }}>
                    <JobMatchCard />
                </div>
                <div style={{ position: 'absolute', right: '8%', bottom: '22%', zIndex: 2 }}>
                    <ResumeCard />
                </div>

                {/* Hero content */}
                <div style={{ textAlign: 'center', zIndex: 10, maxWidth: 680, padding: '0 2rem' }}>
                    {/* Small toast above headline */}
                    <motion.div
                        initial={{ opacity: 0, y: -16, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                            background: 'white', padding: '0.45rem 1rem', borderRadius: 99,
                            fontSize: '0.8rem', color: '#525252', fontWeight: 500,
                            boxShadow: '0 4px 16px rgba(0,0,0,0.08)', marginBottom: '2rem',
                            border: '1px solid rgba(0,0,0,0.06)'
                        }}
                    >
                        <span style={{ width: 8, height: 8, background: '#16a34a', borderRadius: '50%', display: 'inline-block' }} />
                        <span>🎯 89% ATS score achieved — just now</span>
                    </motion.div>

                    {/* BIG Headline */}
                    <motion.h1
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        style={{
                            fontSize: 'clamp(3rem, 8vw, 6rem)',
                            fontWeight: 900,
                            letterSpacing: '-0.04em',
                            lineHeight: 1.05,
                            color: '#0a0a0a',
                            marginBottom: '1.25rem'
                        }}
                    >
                        Land your dream<br />job, faster.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ fontSize: '1.15rem', color: '#737373', lineHeight: 1.65, marginBottom: '2.25rem', maxWidth: 500, margin: '0 auto 2.25rem' }}
                    >
                        AI-powered resume analysis that scores your ATS compatibility,
                        matches live jobs, and tells you exactly what to fix.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.04, boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate('/register')}
                            style={{
                                background: '#0a0a0a', color: 'white',
                                padding: '0.9rem 2rem', borderRadius: 99,
                                fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                                letterSpacing: '-0.01em'
                            }}
                        >
                            Analyze your resume free <ArrowRight size={18} />
                        </motion.button>
                        <motion.button
                            whileHover={{ background: 'white', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
                            onClick={() => navigate('/login')}
                            style={{
                                background: 'transparent', color: '#525252',
                                padding: '0.9rem 1.75rem', borderRadius: 99,
                                fontSize: '1rem', fontWeight: 600, border: '1px solid rgba(0,0,0,0.12)',
                                cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            Log in
                        </motion.button>
                    </motion.div>

                    {/* Trust signal */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.55 }}
                        style={{ fontSize: '0.8rem', color: '#a3a3a3', marginTop: '1.5rem', fontWeight: 500 }}
                    >
                        No credit card required · Free forever plan
                    </motion.p>
                </div>

                {/* Product preview card below hero */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.5 }}
                    style={{
                        marginTop: '4rem', zIndex: 5,
                        background: 'white', borderRadius: 28,
                        border: '1px solid rgba(0,0,0,0.08)',
                        boxShadow: '0 32px 80px rgba(0,0,0,0.12)',
                        padding: '2rem', maxWidth: 700, width: '90%',
                        display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem'
                    }}
                >
                    {[
                        { label: 'ATS Score', value: '89%', icon: BarChart2, color: '#2563eb', trend: '↑ +12 pts' },
                        { label: 'Job Matches', value: '40+', icon: Briefcase, color: '#16a34a', trend: 'Live today' },
                        { label: 'Skills Found', value: '14', icon: Award, color: '#7c3aed', trend: 'Detected' },
                    ].map(({ label, value, icon: Icon, color, trend }) => (
                        <div key={label} style={{ padding: '1.25rem', background: '#fafafa', borderRadius: 16, border: '1px solid rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                                <div style={{ width: 34, height: 34, borderRadius: 10, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon size={18} color={color} />
                                </div>
                                <span style={{ fontSize: '0.7rem', color: '#16a34a', fontWeight: 600, background: '#dcfce7', padding: '2px 8px', borderRadius: 99 }}>{trend}</span>
                            </div>
                            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.04em', lineHeight: 1 }}>{value}</div>
                            <div style={{ fontSize: '0.78rem', color: '#a3a3a3', marginTop: '0.3rem', fontWeight: 500 }}>{label}</div>
                        </div>
                    ))}
                </motion.div>
            </section>

            {/* ─── SOCIAL PROOF ────────────────────────────────────── */}
            <section style={{ padding: '4rem 4rem 3rem', textAlign: 'center', background: '#f2f2f2' }}>
                <motion.p
                    initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    style={{ fontSize: '0.9rem', color: '#a3a3a3', fontWeight: 500, marginBottom: '2rem' }}
                >
                    Used by 10,000+ job seekers landing roles at
                </motion.p>
                <motion.div
                    initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    style={{ display: 'flex', gap: '3rem', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}
                >
                    {LOGOS.map((logo, i) => (
                        <motion.span
                            key={logo}
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                            transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                            style={{ fontSize: '1rem', fontWeight: 800, color: '#c4c4c4', letterSpacing: '-0.02em', fontFamily: 'Outfit, sans-serif' }}
                        >
                            {logo}
                        </motion.span>
                    ))}
                </motion.div>
            </section>

            {/* ─── STATS ───────────────────────────────────────────── */}
            <section style={{ padding: '5rem 4rem', background: 'white' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '2rem' }}>
                    {[
                        { value: '10K+', label: 'Resumes analyzed' },
                        { value: '89%', label: 'Avg ATS score improvement' },
                        { value: '40+', label: 'Jobs matched daily' },
                        { value: '3×', label: 'More interview callbacks' },
                    ].map((s, i) => (
                        <motion.div
                            key={s.value}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08, duration: 0.45 }}
                        >
                            <StatItem {...s} />
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ─── HOW IT WORKS ────────────────────────────────────── */}
            <section style={{ padding: '6rem 4rem', background: '#f2f2f2' }}>
                <div style={{ maxWidth: 960, margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '4rem' }}
                    >
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a3a3a3', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>How it works</p>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0a0a0a' }}>
                            From resume to interview<br />in three steps.
                        </h2>
                    </motion.div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
                        <Step num="01" title="Upload your resume" desc="Drop your PDF or DOCX resume. We extract and analyze all your information instantly." delay={0} />
                        <Step num="02" title="Get your ATS score" desc="Receive a detailed score with specific suggestions on what to fix to beat ATS filters." delay={0.1} />
                        <Step num="03" title="Match real jobs" desc="Get matched to 40+ live job openings tailored to your exact skills and experience level." delay={0.2} />
                    </div>
                </div>
            </section>

            {/* ─── FEATURES ────────────────────────────────────────── */}
            <section style={{ padding: '6rem 4rem', background: 'white' }}>
                <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '3.5rem' }}
                    >
                        <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#a3a3a3', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Features</p>
                        <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.04em', color: '#0a0a0a' }}>
                            Everything you need<br />to land the job.
                        </h2>
                    </motion.div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                        {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
                    </div>
                </div>
            </section>

            {/* ─── FINAL CTA ───────────────────────────────────────── */}
            <section style={{ padding: '7rem 4rem', background: '#0a0a0a', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                >
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#525252', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Get started today</p>
                    <h2 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '-0.04em', color: 'white', marginBottom: '1.25rem', lineHeight: 1.1 }}>
                        Your dream job is<br />one upload away.
                    </h2>
                    <p style={{ fontSize: '1rem', color: '#737373', marginBottom: '2.5rem', lineHeight: 1.65 }}>
                        Join 10,000+ job seekers who improved their resume<br />and landed interviews at top companies.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.04, boxShadow: '0 16px 40px rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/register')}
                        style={{
                            background: 'white', color: '#0a0a0a',
                            padding: '1rem 2.5rem', borderRadius: 99,
                            fontSize: '1rem', fontWeight: 700, border: 'none',
                            cursor: 'pointer', boxShadow: '0 4px 16px rgba(255,255,255,0.1)',
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem'
                        }}
                    >
                        Analyze your resume free <ArrowRight size={18} />
                    </motion.button>
                    <p style={{ fontSize: '0.8rem', color: '#4a4a4a', marginTop: '1rem' }}>No credit card · Free forever</p>
                </motion.div>
            </section>

            {/* ─── FOOTER ──────────────────────────────────────────── */}
            <footer style={{ background: '#0a0a0a', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '2.5rem 4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 26, height: 26, background: 'linear-gradient(135deg,#2563eb,#7c3aed)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Zap size={13} color="white" fill="white" />
                        </div>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'white', letterSpacing: '-0.03em' }}>HireSnap</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#525252' }}>© 2026 HireSnap. All rights reserved.</p>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        {['Privacy', 'Terms', 'Contact'].map(l => (
                            <a key={l} href="#" style={{ fontSize: '0.8rem', color: '#525252', textDecoration: 'none', transition: 'color 0.2s' }}
                                onMouseOver={e => e.target.style.color = 'white'}
                                onMouseOut={e => e.target.style.color = '#525252'}>
                                {l}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
