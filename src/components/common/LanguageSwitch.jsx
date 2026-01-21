import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'fr', name: 'Français', flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', name: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'العربية', flag: '🇹🇳', dir: 'rtl' }
];

const LanguageSwitch = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  
  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];
  
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang.code);
    document.documentElement.dir = lang.dir;
    document.documentElement.lang = lang.code;
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:text-primary-600 hover:bg-neutral-100 rounded-lg transition-colors duration-200"
        aria-label="Change language"
      >
        <Globe className="w-5 h-5" />
        <span className="hidden md:inline">{currentLanguage.flag} {currentLanguage.name}</span>
        <span className="md:hidden">{currentLanguage.flag}</span>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-neutral-200 z-20 py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => changeLanguage(lang)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-neutral-100 transition-colors duration-150 ${
                  currentLanguage.code === lang.code ? 'bg-primary-50 text-primary-600' : 'text-neutral-700'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <span>{lang.name}</span>
                {currentLanguage.code === lang.code && (
                  <span className="ml-auto text-primary-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitch;
