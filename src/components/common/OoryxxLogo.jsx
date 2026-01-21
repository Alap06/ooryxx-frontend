import React from 'react';
import { Link } from 'react-router-dom';
import logoTransparent from '../../data/images/Logos/logo ooryxx sans arrier_plan.png';
import logoFilled from '../../data/images/Logos/logo ooryxx.jpg';
import logoComplete from '../../data/images/Logos/logo_complete.jpeg';

/**
 * Composant Logo Ooryxx avec branding cohérent (Noir et Orange)
 * @param {string} size - Taille du logo: 'sm', 'md', 'lg', 'xl'
 * @param {string} variant - Variante du logo: 'transparent', 'filled', 'complete'
 * @param {boolean} showText - Afficher le texte à côté du logo
 * @param {boolean} animated - Ajouter des animations au logo
 * @param {string} className - Classes CSS supplémentaires
 */
const OoryxxLogo = ({
  size = 'md',
  variant = 'transparent',
  showText = true,
  animated = true,
  darkMode = false,
  className = ''
}) => {
  const sizes = {
    sm: {
      icon: 'w-8 h-8',
      text: 'text-lg',
      tagline: 'text-[10px]'
    },
    md: {
      icon: 'w-10 h-10',
      text: 'text-xl',
      tagline: 'text-xs'
    },
    lg: {
      icon: 'w-14 h-14',
      text: 'text-2xl',
      tagline: 'text-xs'
    },
    xl: {
      icon: 'w-20 h-20',
      text: 'text-3xl',
      tagline: 'text-sm'
    }
  };

  const sizeClasses = sizes[size] || sizes.md;

  const getLogoSource = () => {
    switch (variant) {
      case 'filled':
        return logoFilled;
      case 'complete':
        return logoComplete;
      case 'transparent':
      default:
        return logoTransparent;
    }
  };

  return (
    <Link
      to="/"
      className={`flex items-center gap-3 group select-none ${className}`}
    >
      {/* Icône Logo */}
      <div
        className={`
          ${sizeClasses.icon} 
          flex items-center justify-center 
          transition-transform duration-500
          ${animated ? 'group-hover:scale-110 group-hover:rotate-[360deg] ease-in-out' : ''}
          relative
          z-10
        `}
      >
        <img
          src={getLogoSource()}
          alt="Ooryxx Logo"
          className={`w-full h-full object-contain ${variant === 'filled' ? 'rounded-lg' : ''}`}
        />

        {/* Effet de lueur derrière le logo (Orange) */}
        {animated && variant === 'transparent' && (
          <div className="absolute inset-0 bg-accent-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        )}
      </div>

      {/* Texte Logo */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`
            ${sizeClasses.text} 
            font-heading font-extrabold 
            leading-none
            tracking-tight
            transition-colors duration-300
            ${darkMode ? 'text-white' : 'text-neutral-900'}
            ${animated ? 'group-hover:text-accent-600' : ''}
          `}>
            Ooryxx
          </h1>
          <p className={`
            ${sizeClasses.tagline} 
            font-medium
            tracking-wide
            uppercase
            transition-all duration-300
            ${darkMode ? 'text-neutral-400' : 'text-neutral-500'}
            ${animated ? (darkMode ? 'group-hover:text-neutral-200' : 'group-hover:text-neutral-800') + ' group-hover:tracking-wider' : ''}
          `}>
            Marketplace
          </p>
        </div>
      )}
    </Link>
  );
};

export default OoryxxLogo;
