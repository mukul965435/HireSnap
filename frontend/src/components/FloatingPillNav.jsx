import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

/**
 * FloatingPillNav — shared pill navbar shell
 *
 * Props:
 *  - leftSlot   : node rendered right after the divider (nav links)
 *  - rightSlot  : node rendered in the right section (auth buttons or user avatar)
 *  - onLogoClick: callback when the logo is clicked
 */
const FloatingPillNav = ({ leftSlot, rightSlot, onLogoClick }) => (
    /* Transparent centering wrapper */
    <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', justifyContent: 'center',
        padding: '0.85rem 2rem',
        pointerEvents: 'none',
    }}>
        <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{
                pointerEvents: 'all',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.5rem 0.45rem 1rem',
                background: 'rgba(255,255,255,0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderRadius: 999,
                border: '1px solid rgba(0,0,0,0.09)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
                width: 'fit-content',
                maxWidth: 1250,
            }}
        >
            {/* Logo */}
            <div
                onClick={onLogoClick}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', flexShrink: 0 }}
            >
                <div style={{
                    width: 28, height: 28,
                    background: 'linear-gradient(135deg,#2563eb,#7c3aed)',
                    borderRadius: 8,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Zap size={14} color="white" fill="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: '0.92rem', letterSpacing: '-0.03em', color: '#0a0a0a', whiteSpace: 'nowrap' }}>
                    HireSnap
                </span>
            </div>

            {/* Thin vertical divider */}
            <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.1)', margin: '0 0.75rem', flexShrink: 0 }} />

            {/* Centre slot – nav links */}
            {leftSlot}

            {/* Push right controls to end */}
            <div style={{ flex: 1, minWidth: 24 }} />

            {/* Right slot – auth buttons or avatar */}
            {rightSlot}
        </motion.nav>
    </div>
);

export default FloatingPillNav;
