import React from 'react';
import { motion } from 'framer-motion';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const baseClass = `btn btn-${variant}`;
    const sizeMap = {
        sm: { padding: '0.5rem 1rem', fontSize: '0.8rem' },
        md: { padding: '0.7rem 1.4rem', fontSize: '0.875rem' },
        lg: { padding: '0.9rem 1.8rem', fontSize: '1rem' },
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className={`${baseClass} ${className}`}
            style={sizeMap[size] || sizeMap.md}
            {...props}
        >
            {children}
        </motion.button>
    );
};

export const Card = ({ children, title, subtitle, footer, className = '', hoverable = true, ...props }) => {
    const Wrapper = hoverable ? motion.div : 'div';
    const motionProps = hoverable
        ? { whileHover: { y: -3, boxShadow: '0 20px 56px rgba(0,0,0,0.1)' }, transition: { duration: 0.25 } }
        : {};

    return (
        <Wrapper className={`card ${className}`} {...motionProps} {...props}>
            {(title || subtitle) && (
                <div style={{ marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border)' }}>
                    {title && <h3 style={{ fontSize: '1rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{title}</h3>}
                    {subtitle && <p style={{ color: 'var(--text-2)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{subtitle}</p>}
                </div>
            )}
            {children}
            {footer && (
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
                    {footer}
                </div>
            )}
        </Wrapper>
    );
};

export const Badge = ({ children, variant = 'neutral', ...props }) => (
    <span className={`badge badge-${variant}`} {...props}>{children}</span>
);

export const Pill = ({ children, ...props }) => (
    <span className="pill" {...props}>{children}</span>
);

export const SectionLabel = ({ children, icon: Icon }) => (
    <p className="section-label">
        {Icon && <Icon size={12} />}
        {children}
    </p>
);
