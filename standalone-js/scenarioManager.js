function saveScenarioAdvanced(data){

    let scenarios = JSON.parse(
        localStorage.getItem("iit_scenarios") || "[]"
    );

    scenarios.push({
        id: Date.now(),
        ...data
    });

    localStorage.setItem(
        "iit_scenarios",
        JSON.stringify(scenarios)
    );

    renderScenarioList();
}

function renderScenarioList(){

    const container = document.getElementById("scenarioList");
    if(!container) return;

    const scenarios = JSON.parse(
        localStorage.getItem("iit_scenarios") || "[]"
    );

    container.innerHTML = scenarios.map(s=>`
        <div class="scenario-item">
            Scenario ${s.id}
            <button onclick="loadScenario(${s.id})">Load</button>
        </div>
    `).join("");
}

function loadScenario(id){

    const scenarios = JSON.parse(
        localStorage.getItem("iit_scenarios") || "[]"
    );

    const s = scenarios.find(x=>x.id===id);
    if(!s) return;

    productValue.value = s.product;
    shippingCost.value = s.shipping;
    customsRate.value = s.customs;
    marginRate.value = s.margin;
    country.value = s.country;
    currency.value = s.currency;

    calculate();
}
