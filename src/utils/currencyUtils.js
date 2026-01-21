/**
 * Currency conversion utilities
 * Base currency: TND (Tunisian Dinar)
 * 
 * Exchange rates (approximate, as of 2024)
 * These should ideally be fetched from an API in production
 */

export const CURRENCIES = {
    TND: { code: 'TND', symbol: 'DT', name: 'Dinar Tunisien', rate: 1 },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.31 }, // 1 TND ≈ 0.31 EUR
    USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.32 }, // 1 TND ≈ 0.32 USD
    CNY: { code: 'CNY', symbol: '¥', name: 'Yuan Chinois', rate: 2.30 }, // 1 TND ≈ 2.30 CNY
    USDT: { code: 'USDT', symbol: '₮', name: 'Tether (USDT)', rate: 0.32 } // 1 TND ≈ 0.32 USDT (pegged to USD)
};

// Country to currency mapping for IP-based detection
export const COUNTRY_CURRENCY_MAP = {
    // Tunisia
    'TN': 'TND',

    // China
    'CN': 'CNY',

    // European countries (EUR)
    'AT': 'EUR', 'BE': 'EUR', 'CY': 'EUR', 'EE': 'EUR', 'FI': 'EUR',
    'FR': 'EUR', 'DE': 'EUR', 'GR': 'EUR', 'IE': 'EUR', 'IT': 'EUR',
    'LV': 'EUR', 'LT': 'EUR', 'LU': 'EUR', 'MT': 'EUR', 'NL': 'EUR',
    'PT': 'EUR', 'SK': 'EUR', 'SI': 'EUR', 'ES': 'EUR', 'HR': 'EUR',

    // Default is USD for all other countries
};

/**
 * Get currency code based on country code
 * @param {string} countryCode - ISO 3166-1 alpha-2 country code
 * @returns {string} Currency code
 */
export const getCurrencyByCountry = (countryCode) => {
    return COUNTRY_CURRENCY_MAP[countryCode] || 'USD';
};

/**
 * Convert price from TND to target currency
 * @param {number} priceInTND - Price in Tunisian Dinars
 * @param {string} targetCurrency - Target currency code (TND, EUR, USD, CNY, USDT)
 * @returns {number} Converted price
 */
export const convertPrice = (priceInTND, targetCurrency = 'TND') => {
    if (!priceInTND || isNaN(priceInTND)) return 0;

    const currency = CURRENCIES[targetCurrency];
    if (!currency) {
        console.warn(`Unknown currency: ${targetCurrency}, defaulting to TND`);
        return priceInTND;
    }

    return priceInTND * currency.rate;
};

/**
 * Format price with currency symbol and proper formatting
 * @param {number} price - Price to format
 * @param {string} currencyCode - Currency code (TND, EUR, USD, CNY, USDT)
 * @returns {string} Formatted price string
 */
export const formatPrice = (price, currencyCode = 'TND') => {
    if (!price || isNaN(price)) return '0';

    const currency = CURRENCIES[currencyCode];
    if (!currency) return `${price.toFixed(2)}`;

    const formattedValue = price.toFixed(2);

    // Different formatting based on currency
    switch (currencyCode) {
        case 'TND':
            return `${formattedValue} ${currency.symbol}`;
        case 'EUR':
            return `${currency.symbol}${formattedValue}`;
        case 'USD':
            return `${currency.symbol}${formattedValue}`;
        case 'CNY':
            return `${currency.symbol}${formattedValue}`;
        case 'USDT':
            return `${formattedValue} ${currency.symbol}`;
        default:
            return `${formattedValue} ${currency.symbol}`;
    }
};

/**
 * Convert and format price in one step
 * @param {number} priceInTND - Price in TND
 * @param {string} targetCurrency - Target currency code
 * @returns {string} Converted and formatted price
 */
export const convertAndFormatPrice = (priceInTND, targetCurrency = 'TND') => {
    const converted = convertPrice(priceInTND, targetCurrency);
    return formatPrice(converted, targetCurrency);
};

/**
 * Get all available currencies
 * @returns {Array} Array of currency objects
 */
export const getAvailableCurrencies = () => {
    return Object.values(CURRENCIES);
};

/**
 * Get currency by code
 * @param {string} code - Currency code
 * @returns {Object|null} Currency object or null
 */
export const getCurrency = (code) => {
    return CURRENCIES[code] || null;
};
