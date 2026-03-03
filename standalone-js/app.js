const vatRates = {
    FR: 20,
    DE: 19,
    ES: 21,
    IT: 22,
    NL: 21,
    BE: 21,
    PL: 23,
    PT: 23,
    IE: 23
};

let fxRates = {};
let lastCalculation = null;

/* --------------------------
Load FX Rates
-------------------------- */

async function loadFXRates() {
    try {
        const res = await fetch(
            CONFIG.FX_API + "?base=" + CONFIG.DEFAULT_BASE
        );

        const data = await res.json();
        fxRates = data.rates;

    } catch (e) {
        console.warn("FX API fallback mode");
        fxRates = {
            USD: 1.08,
            GBP: 0.85,
            EUR: 1
        };
    }
}

/* --------------------------
Init UI
-------------------------- */

function initUI() {

    const countrySelect = document.getElementById("country");
    const currencySelect = document.getElementById("currency");

    Object.keys(vatRates).forEach(c => {
        countrySelect.innerHTML +=
            `<option value="${c}">${c}</option>`;
    });

    ["EUR", "USD", "GBP"].forEach(c => {
        currencySelect.innerHTML +=
            `<option value="${c}">${c}</option>`;
    });
}

/* --------------------------
Calculator Core
-------------------------- */

function calculate() {

    const product = parseFloat(productValue.value) || 0;
    const shipping = parseFloat(shippingCost.value) || 0;
    const customs = parseFloat(customsRate.value) || 0;
    const margin = parseFloat(marginRate.value) || 0;

    const country = country.value;
    const currency = currency.value;

    const vatRate = vatRates[country] || 0;

    const customsAmount = product * customs / 100;

    const subtotal = product + shipping + customsAmount;

    const vatAmount = subtotal * vatRate / 100;

    const totalEUR = subtotal + vatAmount;

    const sellingEUR = totalEUR * (1 + margin / 100);

    const fx = fxRates[currency] || 1;

    const total = totalEUR * fx;
    const selling = sellingEUR * fx;

    lastCalculation = {
        customsAmount,
        vatAmount,
        total,
        selling,
        currency
    };

    document.getElementById("result").innerHTML = `
        <h3>Result</h3>
        Customs: ${customsAmount.toFixed(2)} EUR<br>
        VAT: ${vatAmount.toFixed(2)} EUR<br>
        <hr>
        Total Cost: ${total.toFixed(2)} ${currency}<br>
        Selling Price: ${selling.toFixed(2)} ${currency}
    `;
}

/* --------------------------
Scenario Storage
-------------------------- */

function saveScenario() {

    const scenario = {
        product: productValue.value,
        shipping: shippingCost.value,
        customs: customsRate.value,
        margin: marginRate.value,
        country: country.value,
        currency: currency.value
    };

    localStorage.setItem(
        "landedCostScenario",
        JSON.stringify(scenario)
    );

    alert("Scenario saved!");
}

/* --------------------------
Startup
-------------------------- */

window.onload = async () => {

    initUI();
    await loadFXRates();
};
