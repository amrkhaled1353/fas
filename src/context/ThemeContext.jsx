import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    // 1. Check local storage for saved theme, otherwise check system preference
    const [isDarkMode, setIsDarkMode] = useState(() => {
        const savedTheme = localStorage.getItem('app-theme');
        if (savedTheme) {
            return savedTheme === 'dark';
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    // 2. Update local storage and document attribute when theme changes
    useEffect(() => {
        const root = document.documentElement;
        if (isDarkMode) {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('app-theme', 'dark');
        } else {
            root.setAttribute('data-theme', 'light');
            localStorage.setItem('app-theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prev) => !prev);
    };

    const value = {
        isDarkMode,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
