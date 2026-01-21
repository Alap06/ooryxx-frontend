import React, { createContext, useState, useContext, useEffect } from 'react';
import { convertAndFormatPrice, convertPrice, CURRENCIES, getCurrencyByCountry } from '../utils/currencyUtils';

const CurrencyContext = createContext(null);

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

/**
 * Detect user's country using IP geolocation API
 * Uses free ip-api.com service
 */
const detectCountryFromIP = async () => {
    try {
        // Using ip-api.com (free, no API key required, 45 requests/minute limit)
        const response = await fetch('http://ip-api.com/json/?fields=countryCode');
        if (!response.ok) throw new Error('Geolocation API error');

        const data = await response.json();
        return data.countryCode || null;
    } catch (error) {
        console.warn('Failed to detect country from IP:', error);
        // Fallback: try another free service
        try {
            const fallbackResponse = await fetch('https://ipapi.co/country/');
            if (fallbackResponse.ok) {
                const countryCode = await fallbackResponse.text();
                return countryCode.trim();
            }
        } catch (fallbackError) {
            console.warn('Fallback geolocation also failed:', fallbackError);
        }
        return null;
    }
};

export const CurrencyProvider = ({ children }) => {
    const [selectedCurrency, setSelectedCurrency] = useState('TND');
    const [detectedCountry, setDetectedCountry] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Detect country and set currency on first visit
    useEffect(() => {
        const initializeCurrency = async () => {
            // Check if user has a saved preference
            const savedCurrency = localStorage.getItem('selectedCurrency');
            const hasVisited = localStorage.getItem('hasVisitedBefore');

            if (savedCurrency && CURRENCIES[savedCurrency]) {
                // User has a saved preference, use it
                setSelectedCurrency(savedCurrency);
                setIsLoading(false);
                return;
            }

            // First time visitor - detect country via IP
            if (!hasVisited) {
                const countryCode = await detectCountryFromIP();

                if (countryCode) {
                    setDetectedCountry(countryCode);
                    const detectedCurrency = getCurrencyByCountry(countryCode);
                    setSelectedCurrency(detectedCurrency);

                    // Save the detected currency and mark as visited
                    localStorage.setItem('selectedCurrency', detectedCurrency);
                    localStorage.setItem('hasVisitedBefore', 'true');
                    localStorage.setItem('detectedCountry', countryCode);

                    console.log(`Detected country: ${countryCode}, currency set to: ${detectedCurrency}`);
                }
            }

            setIsLoading(false);
        };

        initializeCurrency();
    }, []);

    // Save currency preference to localStorage when it changes
    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('selectedCurrency', selectedCurrency);
        }
    }, [selectedCurrency, isLoading]);

    const changeCurrency = (currencyCode) => {
        if (CURRENCIES[currencyCode]) {
            setSelectedCurrency(currencyCode);
        } else {
            console.warn(`Invalid currency code: ${currencyCode}`);
        }
    };

    const formatPrice = (priceInTND) => {
        return convertAndFormatPrice(priceInTND, selectedCurrency);
    };

    const convert = (priceInTND) => {
        return convertPrice(priceInTND, selectedCurrency);
    };

    const getCurrencyInfo = () => {
        return CURRENCIES[selectedCurrency];
    };

    const value = {
        selectedCurrency,
        changeCurrency,
        formatPrice,
        convert,
        getCurrencyInfo,
        availableCurrencies: Object.values(CURRENCIES),
        detectedCountry,
        isLoading
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

export default CurrencyContext;
