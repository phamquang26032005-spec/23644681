import React, { createContext, useContext, useState, useMemo } from 'react';

interface ThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => setIsDarkMode(prev => !prev);

    const value = useMemo(() => ({ isDarkMode, toggleTheme }), [isDarkMode]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme phải được sử dụng bên trong ThemeProvider');
    }
    return context;
};