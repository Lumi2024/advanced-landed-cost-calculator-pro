const vatRates = {
    FR:20,
    DE:19,
    ES:21,
    IT:22,
    NL:21,
    BE:21,
    PL:23,
    PT:23,
    IE:23
};

let fxRates = {};
let chartInstance = null;
let lastCalculation = null;

/* ======================
FX API Loader
====================== */

async function loadFXRates(){

    try{

        const res = await fetch(
            CONFIG.FX_API + "?base=" + CONFIG.BASE_CURRENCY
        );

        const data = await res.json();

        fxRates = data.rates;

    }catch(e){

        fxRates = {
            USD:1.08,
            GBP:0.85,
            EUR:1
        };
    }
}

/* ======================
UI INIT
====================== */

function initUI(){

    const countrySelect = document.getElementById("country");
    const currencySelect = document.getElementById("currency");

    Object.keys(vatRates).forEach(c=>{
        countrySelect.innerHTML+=
            `<option value="${c}">${c}</option>`;
    });

    ["EUR","USD","GBP"].forEach(c=>{
        currencySelect.innerHTML+=
            `<option value="${c}">${c}</option>`;
    });
}

/* ======================
Core Calculation Engine
====================== */

function calculate(){

    const product = parseFloat(productValue.value)||0;
    const shipping = parseFloat(shippingCost.value)||0;
    const customs = parseFloat(customsRate.value)||0;
    const margin = parseFloat(marginRate.value)||0;

    const country = document.getElementById("country").value;
    const currency = document.getElementById("currency").value;

    const vatRate = vatRates[country] || CONFIG.VAT_DEFAULT;

    const customsAmount = product * customs/100;

    const subtotal = product + shipping + customsAmount;

    const vatAmount = subtotal * vatRate/100;

    const totalEUR = subtotal + vatAmount;

    const sellingEUR = totalEUR * (1 + margin/100);

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

    renderResult();
    renderChart(total, selling);
}

/* ======================
UI Rendering
====================== */

function renderResult(){

    if(!lastCalculation) return;

    document.getElementById("result").innerHTML=`
    <h3>Business Breakdown</h3>

    Customs: ${lastCalculation.customsAmount.toFixed(2)} EUR<br>
    VAT: ${lastCalculation.vatAmount.toFixed(2)} EUR<br>

    <hr>

    Total Cost: ${lastCalculation.total.toFixed(2)} ${lastCalculation.currency}<br>
    Selling Price: ${lastCalculation.selling.toFixed(2)} ${lastCalculation.currency}
    `;
}

/* ======================
Chart Visualization
====================== */

function renderChart(total,selling){

    if(!CONFIG.ENABLE_CHART) return;

    const ctx = document.getElementById("profitChart");

    if(chartInstance){
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx,{
        type:"bar",
        data:{
            labels:["Cost","Selling"],
            datasets:[{
                data:[total,selling]
            }]
        },
        options:{
            responsive:true
        }
    });
}

/* ======================
Scenario Storage
====================== */

function saveScenario(){

    const scenario = {
        product:productValue.value,
        shipping:shippingCost.value,
        customs:customsRate.value,
        margin:marginRate.value,
        country:country.value,
        currency:currency.value
    };

    localStorage.setItem(
        "importSimulatorScenario",
        JSON.stringify(scenario)
    );

    alert("Scenario saved!");
}

/* ======================
Startup
====================== */

window.onload=async()=>{

    initUI();
    await loadFXRates();
};
