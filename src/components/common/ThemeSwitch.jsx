import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Palette, Moon, Sun } from 'lucide-react';

const ThemeSwitch = () => {
  const { currentTheme, isDark, changeTheme, toggleDarkMode, colorThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      {/* Bouton Mode Sombre/Clair */}
      <button
        onClick={toggleDarkMode}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-primary-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors duration-200"
        aria-label="Toggle dark mode"
      >
        {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
      
      {/* Bouton Sélection de Couleur */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="ml-2 flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:text-primary-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors duration-200"
        aria-label="Change color theme"
      >
        <Palette className="w-5 h-5" />
        <span className="hidden md:inline">Couleur</span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-20 p-4">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-3">
              Choisir un thème
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(colorThemes).filter(([key]) => key !== 'dark').map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => {
                    changeTheme(key);
                    setIsOpen(false);
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 ${
                    currentTheme === key && !isDark
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex gap-1">
                    <div 
                      className="w-6 h-6 rounded-full border border-neutral-200"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-neutral-200"
                      style={{ backgroundColor: theme.secondary }}
                    />
                  </div>
                  <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    {theme.name}
                  </span>
                  {currentTheme === key && !isDark && (
                    <span className="text-primary-600 text-xs">✓ Actif</span>
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => {
                  toggleDarkMode();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all duration-200 ${
                  isDark
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5 text-neutral-700 dark:text-neutral-300" />
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Mode Sombre
                  </span>
                </div>
                {isDark && (
                  <span className="text-primary-600 text-sm">✓</span>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSwitch;
