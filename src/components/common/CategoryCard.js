import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
    const { _id, name, slug, image, icon, productCount, description } = category;

    return (
        <Link
            to={`/products?category=${slug || _id}`}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-neutral-50 border border-neutral-200 hover:border-primary-300 transition-all duration-500 hover:shadow-2xl hover:shadow-primary-500/20 hover:-translate-y-2"
        >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0">
                {image && (
                    <img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all duration-700"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative p-8 flex flex-col items-center text-center min-h-[240px] justify-between">
                {/* Icon */}
                <div className="relative mb-4">
                    <div className="absolute inset-0 bg-primary-500/20 rounded-full blur-2xl group-hover:bg-primary-500/40 transition-all duration-500"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-full flex items-center justify-center text-4xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl">
                        {icon || '📦'}
                    </div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-heading font-bold text-neutral-800 mb-2 group-hover:text-primary-600 transition-colors duration-300">
                    {name}
                </h3>

                {/* Description */}
                {description && (
                    <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                        {description}
                    </p>
                )}

                {/* Product Count */}
                <div className="flex items-center gap-2 text-neutral-500 text-sm">
                    <span className="font-semibold text-primary-600">
                        {productCount || 0}
                    </span>
                    <span>produits</span>
                </div>

                {/* Arrow Icon */}
                <div className="absolute bottom-4 right-4 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>

            {/* Animated Border */}
            <div className="absolute inset-0 border-2 border-primary-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </Link>
    );
};

export default CategoryCard;
