(function(){
  const labels = {
    rate: "Electricity price", kwh: "Energy per cycle", watts: "Appliance power",
    minutes: "Minutes per use", usesDay: "Uses per day", usesWeek: "Uses per week",
    hoursDay: "Hours used per active day", daysWeek: "Active days per week",
    battery: "Battery capacity", added: "Battery percentage added", efficiency: "Charging efficiency"
  };
  const fields = {
    cycle: ["rate", "kwh", "usesWeek"],
    "power-day": ["rate", "watts", "minutes", "usesDay"],
    "power-week": ["rate", "watts", "minutes", "usesWeek"],
    "power-hours": ["rate", "watts", "hoursDay", "daysWeek"],
    ev: ["rate", "battery", "added", "efficiency", "usesWeek"]
  };

  function readValues(form, kind){
    const values = {};
    for(const name of fields[kind]){
      const raw = form.elements[name]?.value;
      if(raw == null || String(raw).trim() === ""){
        throw new Error(`Please enter ${labels[name].toLowerCase()}.`);
      }
      const value = Number(raw);
      if(!Number.isFinite(value)){
        throw new Error(`${labels[name]} must be a finite number.`);
      }
      const minimum = name === "efficiency" ? 1 : 0;
      const maximum = {hoursDay: 24, daysWeek: 7, added: 100, efficiency: 100}[name];
      if(value < minimum || (maximum !== undefined && value > maximum)){
        throw new Error(maximum === undefined
          ? `${labels[name]} must be zero or greater.`
          : `${labels[name]} must be between ${minimum} and ${maximum}.`);
      }
      values[name] = value;
    }
    return values;
  }

  function calculate(kind, v){
    let energy, weeklyUses, annualUses, suffix = "";
    if(kind === "cycle"){
      energy = v.kwh;
      weeklyUses = v.usesWeek;
    }else if(kind === "power-day" || kind === "power-week"){
      energy = (v.watts / 1000) * (v.minutes / 60);
      weeklyUses = kind === "power-day" ? v.usesDay * 7 : v.usesWeek;
      annualUses = kind === "power-day" ? v.usesDay * 365 : v.usesWeek * 52;
    }else if(kind === "power-hours"){
      energy = (v.watts / 1000) * v.hoursDay;
      weeklyUses = v.daysWeek;
      suffix = " active days";
    }else if(kind === "ev"){
      energy = (v.battery * (v.added / 100)) / (v.efficiency / 100);
      weeklyUses = v.usesWeek;
      suffix = " charging sessions";
    }
    if(annualUses === undefined) annualUses = weeklyUses * 52;
    const perUse = energy * (v.rate / 100);
    const perWeek = perUse * weeklyUses;
    const annualKwh = energy * annualUses;
    const perYear = kind === "power-day" ? annualKwh * (v.rate / 100) : perWeek * 52;
    const perMonth = kind === "power-day" ? perYear / 12 : perWeek * 52 / 12;
    const comparison = kind === "cycle" ? [1, 3, 5, 7, 10].map(uses => ({
      uses, month: perUse * uses * 52 / 12, year: perUse * uses * 52
    })) : [];
    const numbers = [energy, weeklyUses, annualUses, perUse, perWeek, annualKwh, perYear, perMonth,
      ...comparison.flatMap(row => [row.month, row.year])];
    if(!numbers.every(Number.isFinite)){
      throw new Error("These values produce a result that is too large. Please check your inputs.");
    }
    return {energy, annualUses, annualKwh, perUse, perWeek, perMonth, perYear, suffix, comparison};
  }

  function render(root, result, kind, scroll){
    const money = n => "£" + n.toFixed(2);
    const outputs = {
      perUse: money(result.perUse), perWeek: money(result.perWeek),
      perMonth: money(result.perMonth), perYear: money(result.perYear),
      annualUses: Math.round(result.annualUses).toLocaleString("en-GB") + result.suffix,
      annualKwh: result.annualKwh.toFixed(1) + " kWh"
    };
    if(kind === "power-day" || kind === "power-week") outputs.kwhPerUse = result.energy.toFixed(3) + " kWh";
    if(kind === "ev") outputs.energyPerCharge = result.energy.toFixed(1) + " kWh";
    for(const [key, value] of Object.entries(outputs)){
      const el = root.querySelector(`[data-out="${key}"]`);
      if(el) el.textContent = value;
    }
    const tbody = root.querySelector("[data-comparison]");
    if(tbody){
      tbody.innerHTML = "";
      result.comparison.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${row.uses}</td><td>${money(row.month)}</td><td>${money(row.year)}</td>`;
        tbody.appendChild(tr);
      });
    }
    const results = root.querySelector(".results");
    if(results){
      results.classList.add("is-visible");
      if(scroll){
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        results.scrollIntoView({behavior: reduceMotion ? "instant" : "smooth", block: "nearest"});
      }
    }
  }

  document.querySelectorAll("[data-calculator]").forEach(root => {
    const form = root.querySelector("form");
    const kind = root.dataset.calculator;
    if(!form || !fields[kind]) return;
    const error = document.createElement("p");
    error.className = "note";
    error.setAttribute("role", "alert");
    error.hidden = true;
    form.appendChild(error);
    function update(scroll){
      try{
        const result = calculate(kind, readValues(form, kind));
        error.hidden = true;
        error.textContent = "";
        render(root, result, kind, scroll);
      }catch(problem){
        error.textContent = problem.message;
        error.hidden = false;
      }
    }
    form.addEventListener("submit", event => {
      event.preventDefault();
      update(true);
    });
    update(false);
  });
})();
