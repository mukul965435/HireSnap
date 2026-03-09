import React from 'react';

export const Button = ({ children, variant = 'primary', size = 'md', className = '', ...props }) => {
    const baseStyles = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 600,
        borderRadius: '10px',
        transition: 'var(--transition-smooth)',
        gap: '0.5rem',
        border: 'none',
        outline: 'none',
    };

    const variants = {
        primary: {
            background: 'var(--accent-gradient)',
            color: 'white',
            boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
        },
        secondary: {
            background: 'rgba(255, 255, 255, 0.08)',
            color: 'white',
            border: '1px solid var(--border-color)',
        },
        outline: {
            background: 'transparent',
            color: 'white',
            border: '1px solid var(--border-color)',
        },
        ghost: {
            background: 'transparent',
            color: 'var(--text-secondary)',
        },
    };

    const sizes = {
        sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
        md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
        lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
    };

    const currentVariant = variants[variant] || variants.primary;
    const currentSize = sizes[size] || sizes.md;

    return (
        <button
            style={{ ...baseStyles, ...currentVariant, ...currentSize }}
            className={className}
            {...props}
        >
            {children}
        </button>
    );
};

export const Card = ({ children, title, subtitle, footer, className = '', ...props }) => {
    return (
        <div className={`glass-card ${className}`} {...props}>
            {(title || subtitle) && (
                <div style={{ marginBottom: '1.5rem' }}>
                    {title && <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{title}</h3>}
                    {subtitle && <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{subtitle}</p>}
                </div>
            )}
            <div className="card-content">
                {children}
            </div>
            {footer && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                    {footer}
                </div>
            )}
        </div>
    );
};
