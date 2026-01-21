import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Palettes de couleurs prédéfinies
export const colorThemes = {
  blue: {
    name: 'Bleu Classique',
    primary: '#3b82f6',
    primaryDark: '#1d4ed8',
    secondary: '#6366f1',
    accent: '#f97316',
    bg: '#ffffff',
    bgSecondary: '#f8fafc',
    text: '#0f172a',
    textSecondary: '#64748b'
  },
  ocean: {
    name: 'Océan',
    primary: '#0ea5e9',
    primaryDark: '#0284c7',
    secondary: '#06b6d4',
    accent: '#f59e0b',
    bg: '#ffffff',
    bgSecondary: '#f0f9ff',
    text: '#0c4a6e',
    textSecondary: '#475569'
  },
  purple: {
    name: 'Violet Moderne',
    primary: '#8b5cf6',
    primaryDark: '#7c3aed',
    secondary: '#a78bfa',
    accent: '#ec4899',
    bg: '#ffffff',
    bgSecondary: '#faf5ff',
    text: '#1e1b4b',
    textSecondary: '#6b7280'
  },
  green: {
    name: 'Vert Nature',
    primary: '#10b981',
    primaryDark: '#059669',
    secondary: '#34d399',
    accent: '#f59e0b',
    bg: '#ffffff',
    bgSecondary: '#f0fdf4',
    text: '#064e3b',
    textSecondary: '#6b7280'
  },
  dark: {
    name: 'Mode Sombre',
    primary: '#60a5fa',
    primaryDark: '#3b82f6',
    secondary: '#818cf8',
    accent: '#fb923c',
    bg: '#0f172a',
    bgSecondary: '#1e293b',
    text: '#f1f5f9',
    textSecondary: '#cbd5e1'
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('themeColor') || 'blue';
  });
  
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  // Appliquer le thème au chargement
  useEffect(() => {
    applyTheme(currentTheme, isDark);
  }, [currentTheme, isDark]);
  
  const applyTheme = (themeName, dark) => {
    const theme = dark ? colorThemes.dark : colorThemes[themeName];
    const root = document.documentElement;
    
    // Appliquer les couleurs CSS personnalisées
    root.style.setProperty('--color-primary', theme.primary);
    root.style.setProperty('--color-primary-dark', theme.primaryDark);
    root.style.setProperty('--color-secondary', theme.secondary);
    root.style.setProperty('--color-accent', theme.accent);
    root.style.setProperty('--color-bg', theme.bg);
    root.style.setProperty('--color-bg-secondary', theme.bgSecondary);
    root.style.setProperty('--color-text', theme.text);
    root.style.setProperty('--color-text-secondary', theme.textSecondary);
    
    // Ajouter ou retirer la classe dark
    if (dark) {
      root.classList.add('dark');
      document.body.style.backgroundColor = theme.bg;
      document.body.style.color = theme.text;
    } else {
      root.classList.remove('dark');
      document.body.style.backgroundColor = '#ffffff';
      document.body.style.color = '#0f172a';
    }
  };
  
  const changeTheme = (themeName) => {
    setCurrentTheme(themeName);
    localStorage.setItem('themeColor', themeName);
  };
  
  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
  };
  
  const value = {
    currentTheme,
    isDark,
    changeTheme,
    toggleDarkMode,
    colorThemes,
    currentColors: isDark ? colorThemes.dark : colorThemes[currentTheme]
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
