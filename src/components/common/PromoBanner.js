import React from 'react';
import { Link } from 'react-router-dom';

const PromoBanner = ({ title, subtitle, description, image, link, bgGradient, badge }) => {
    return (
        <Link
            to={link || '/products?sale=true'}
            className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-[1.02]"
        >
            {/* Background */}
            <div className={`absolute inset-0 ${bgGradient || 'bg-gradient-to-r from-accent-500 via-primary-600 to-secondary-700'}`}>
                <div className="absolute inset-0 bg-black/20"></div>
                {image && (
                    <img
                        src={image}
                        alt={title}
                        className="w-full h-full object-cover opacity-30 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000"
                    />
                )}
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400/10 rounded-full blur-2xl"></div>

            {/* Content */}
            <div className="relative min-h-[300px] p-12 flex flex-col justify-center">
                {/* Badge */}
                {badge && (
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-white font-semibold text-sm mb-4 w-fit animate-bounce">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {badge}
                    </div>
                )}

                {/* Title */}
                <h2 className="text-5xl md:text-6xl font-heading font-black text-white mb-4 leading-tight drop-shadow-2xl">
                    {title}
                </h2>

                {/* Subtitle */}
                {subtitle && (
                    <p className="text-2xl md:text-3xl font-bold text-accent-300 mb-4 drop-shadow-lg">
                        {subtitle}
                    </p>
                )}

                {/* Description */}
                {description && (
                    <p className="text-lg text-white/90 max-w-2xl mb-8 drop-shadow">
                        {description}
                    </p>
                )}

                {/* CTA Button */}
                <div className="flex gap-4">
                    <button className="group/btn bg-white text-primary-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-accent-400 hover:text-white transition-all duration-300 shadow-2xl hover:shadow-accent-500/50 hover:scale-105 transform flex items-center gap-2">
                        Découvrir
                        <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default PromoBanner;
