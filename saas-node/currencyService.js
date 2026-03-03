// currencyService.js

const currencyRates = {
    EUR: 1,
    USD: 1.08,
    GBP: 0.85
};

function convert(amountEUR, targetCurrency) {
    const rate = currencyRates[targetCurrency.toUpperCase()] || 1;
    return amountEUR * rate;
}

function getSupportedCurrencies() {
    return Object.keys(currencyRates);
}

module.exports = {
    convert,
    getSupportedCurrencies
};
