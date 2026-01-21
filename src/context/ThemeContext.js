import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('blue');

  // Charger le thème depuis localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const savedPrimaryColor = localStorage.getItem('primaryColor') || 'blue';
    
    setTheme(savedTheme);
    setPrimaryColor(savedPrimaryColor);
    
    // Appliquer le thème au document
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedTheme);
  }, []);

  // Changer le thème
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  // Changer la couleur primaire
  const changePrimaryColor = (color) => {
    setPrimaryColor(color);
    localStorage.setItem('primaryColor', color);
    
    // Ici vous pourriez appliquer la couleur dynamiquement
    document.documentElement.style.setProperty('--primary-color', color);
  };

  const value = {
    theme,
    primaryColor,
    toggleTheme,
    changePrimaryColor,
    isDark: theme === 'dark'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};