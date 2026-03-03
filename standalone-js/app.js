const vatRates = {
    FR:20, DE:19, ES:21, IT:22,
    NL:21, BE:21, PL:23, PT:23, IE:23
};

let fxRates = {};
let chartInstance = null;
let lastCalculation = null;

async function loadFXRates(){
    try{
        const res = await fetch(
            CONFIG.FX_API + "?base=" + CONFIG.BASE_CURRENCY
        );
        const data = await res.json();
        fxRates = data.rates;
    }catch{
        fxRates = {USD:1.08, GBP:0.85, EUR:1};
    }
}

function initUI(){
    Object.keys(vatRates).forEach(c=>{
        country.innerHTML += `<option>${c}</option>`;
    });

    ["EUR","USD","GBP"].forEach(c=>{
        currency.innerHTML += `<option>${c}</option>`;
    });
}

function calculate(){

    const product = parseFloat(productValue.value)||0;
    const shipping = parseFloat(shippingCost.value)||0;
    const customs = parseFloat(customsRate.value)||0;
    const margin = parseFloat(marginRate.value)||0;

    const vatRate = vatRates[country.value] || CONFIG.VAT_DEFAULT;

    const customsAmount = product * customs/100;
    const subtotal = product + shipping + customsAmount;
    const vatAmount = subtotal * vatRate/100;
    const totalEUR = subtotal + vatAmount;

    const sellingEUR = totalEUR * (1 + margin/100);
    const profitEUR = sellingEUR - totalEUR;

    const fx = fxRates[currency.value] || 1;

    const total = totalEUR * fx;
    const selling = sellingEUR * fx;
    const profit = profitEUR * fx;

    lastCalculation = {
        total, selling, profit,
        marginPercent: margin,
        currency: currency.value
    };

    renderResult();
    renderChart(total, selling, profit);

    saveScenarioAdvanced({
        product:productValue.value,
        shipping:shippingCost.value,
        customs:customsRate.value,
        margin:marginRate.value,
        country:country.value,
        currency:currency.value
    });
}

function renderResult(){

    result.innerHTML = `
    <h4>Financial Summary</h4>
    Total Cost: ${lastCalculation.total.toFixed(2)} ${lastCalculation.currency}<br>
    Selling Price: ${lastCalculation.selling.toFixed(2)} ${lastCalculation.currency}<br>
    Net Profit: ${lastCalculation.profit.toFixed(2)} ${lastCalculation.currency}<br>
    Margin Target: ${lastCalculation.marginPercent}%
    `;
}

function renderChart(total, selling, profit){

    if(chartInstance) chartInstance.destroy();

    chartInstance = new Chart(profitChart,{
        type:"bar",
        data:{
            labels:["Cost","Selling","Profit"],
            datasets:[{
                data:[total,selling,profit]
            }]
        },
        options:{responsive:true}
    });
}

function toggleTheme(){
    document.body.classList.toggle("dark");
}

window.onload=async()=>{
    checkAuth();
    initUI();
    await loadFXRates();
    renderScenarioList();
};
