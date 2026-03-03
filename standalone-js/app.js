const vatRates = {
    FR: 20,
    DE: 19,
    ES: 21,
    IT: 22
};

const currencyRates = {
    EUR: 1,
    USD: 1.08,
    GBP: 0.85
};

let lastCalculation = null;

function calculate() {

    const product = parseFloat(productValue.value) || 0;
    const shipping = parseFloat(shippingCost.value) || 0;
    const customs = parseFloat(customsRate.value) || 0;
    const margin = parseFloat(marginRate.value) || 0;
    const country = document.getElementById("country").value;
    const currency = document.getElementById("currency").value;

    const customsAmount = product * (customs / 100);
    const subtotal = product + shipping + customsAmount;
    const vatAmount = subtotal * (vatRates[country] / 100);
    const totalCostEUR = subtotal + vatAmount;
    const sellingPriceEUR = totalCostEUR * (1 + margin / 100);

    const convertedTotal = totalCostEUR * currencyRates[currency];
    const convertedSelling = sellingPriceEUR * currencyRates[currency];

    lastCalculation = {
        customsAmount,
        vatAmount,
        totalCostEUR,
        sellingPriceEUR,
        convertedTotal,
        convertedSelling,
        currency
    };

    document.getElementById("result").innerHTML = `
        <strong>Breakdown:</strong><br>
        Customs: ${customsAmount.toFixed(2)} EUR<br>
        VAT: ${vatAmount.toFixed(2)} EUR<br><br>
        <strong>Total Cost:</strong> ${convertedTotal.toFixed(2)} ${currency}<br>
        <strong>Selling Price:</strong> ${convertedSelling.toFixed(2)} ${currency}
    `;
}

function saveScenario() {
    const scenario = {
        product: productValue.value,
        shipping: shippingCost.value,
        customs: customsRate.value,
        margin: marginRate.value,
        country: country.value,
        currency: currency.value
    };

    localStorage.setItem("landedCostScenario", JSON.stringify(scenario));
    alert("Scenario saved!");
}

function loadScenario() {
    const saved = localStorage.getItem("landedCostScenario");
    if (!saved) return alert("No saved scenario");

    const scenario = JSON.parse(saved);

    productValue.value = scenario.product;
    shippingCost.value = scenario.shipping;
    customsRate.value = scenario.customs;
    marginRate.value = scenario.margin;
    country.value = scenario.country;
    currency.value = scenario.currency;

    calculate();
}
