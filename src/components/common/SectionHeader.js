import React from 'react';

const SectionHeader = ({ title, subtitle, icon, viewAllLink }) => {
    return (
        <div className="flex items-center justify-between mb-8 animate-fade-in">
            <div className="flex items-center gap-4">
                {icon && (
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                        {icon}
                    </div>
                )}
                <div>
                    <h2 className="text-3xl md:text-4xl font-heading font-black text-neutral-800 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        {title}
                    </h2>
                    {subtitle && (
                        <p className="text-neutral-600 mt-1">{subtitle}</p>
                    )}
                </div>
            </div>

            {viewAllLink && (
                <a
                    href={viewAllLink}
                    className="group flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
                >
                    <span>Voir tout</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </a>
            )}
        </div>
    );
};

export default SectionHeader;
