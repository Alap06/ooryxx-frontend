import React, { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../../context/CurrencyContext';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

const CurrencySelector = ({ className = '' }) => {
    const { selectedCurrency, changeCurrency, availableCurrencies, getCurrencyInfo } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currentCurrency = getCurrencyInfo();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCurrencyChange = (currencyCode) => {
        changeCurrency(currencyCode);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-neutral-200 rounded-lg hover:border-primary-500 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                aria-label="Sélectionner la devise"
            >
                <span className="font-semibold text-neutral-700">{currentCurrency.symbol}</span>
                <span className="text-sm text-neutral-600">{currentCurrency.code}</span>
                <ChevronDownIcon
                    className={`w-4 h-4 text-neutral-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 overflow-hidden">
                    <div className="py-1">
                        {availableCurrencies.map((currency) => (
                            <button
                                key={currency.code}
                                onClick={() => handleCurrencyChange(currency.code)}
                                className={`w-full text-left px-4 py-2 hover:bg-neutral-50 transition-colors duration-150 ${selectedCurrency === currency.code
                                        ? 'bg-primary-50 text-primary-700 font-semibold'
                                        : 'text-neutral-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{currency.symbol}</span>
                                        <div>
                                            <div className="text-sm font-medium">{currency.code}</div>
                                            <div className="text-xs text-neutral-500">{currency.name}</div>
                                        </div>
                                    </div>
                                    {selectedCurrency === currency.code && (
                                        <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrencySelector;
