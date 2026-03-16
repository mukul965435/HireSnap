import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Read saved preference, default to dark
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('hiresnap-theme') || 'dark';
    });

    useEffect(() => {
        const root = document.documentElement;

        if (theme === 'dark') {
            root.setAttribute('data-theme', 'dark');
        } else {
            root.setAttribute('data-theme', 'light');
        }

        localStorage.setItem('hiresnap-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
