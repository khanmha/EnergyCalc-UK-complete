
(function(){
  const money = n => "£" + Number(n).toFixed(2);
  const num = (form, name) => Number(form.elements[name]?.value || 0);

  function setText(root, key, value){
    const el = root.querySelector(`[data-out="${key}"]`);
    if(el) el.textContent = value;
  }

  function showResults(root){
    const results = root.querySelector(".results");
    if(results){
      results.classList.add("is-visible");
      results.scrollIntoView({behavior:"smooth", block:"nearest"});
    }
  }

  function calculateCycle(form, root){
    const rateP = num(form,"rate");
    const kwh = num(form,"kwh");
    const usesWeek = num(form,"usesWeek");
    const perUse = kwh * (rateP / 100);
    const perWeek = perUse * usesWeek;
    const perMonth = perWeek * 52 / 12;
    const perYear = perWeek * 52;

    setText(root,"perUse",money(perUse));
    setText(root,"perWeek",money(perWeek));
    setText(root,"perMonth",money(perMonth));
    setText(root,"perYear",money(perYear));
    setText(root,"annualUses",Math.round(usesWeek*52).toLocaleString("en-GB"));
    setText(root,"annualKwh",(kwh*usesWeek*52).toFixed(1)+" kWh");

    const tbody = root.querySelector("[data-comparison]");
    if(tbody){
      tbody.innerHTML="";
      [1,3,5,7,10].forEach(v=>{
        const wk = perUse*v;
        const mo = wk*52/12;
        const yr = wk*52;
        const tr=document.createElement("tr");
        tr.innerHTML=`<td>${v}</td><td>${money(mo)}</td><td>${money(yr)}</td>`;
        tbody.appendChild(tr);
      });
    }
    showResults(root);
  }

  function calculatePowerUses(form, root, frequency){
    const rateP = num(form,"rate");
    const watts = num(form,"watts");
    const minutes = num(form,"minutes");
    const uses = num(form, frequency==="day" ? "usesDay" : "usesWeek");
    const kwhPerUse = (watts/1000)*(minutes/60);
    const perUse = kwhPerUse*(rateP/100);
    const perWeek = frequency==="day" ? perUse*uses*7 : perUse*uses;
    const perMonth = perWeek*52/12;
    const perYear = perWeek*52;

    setText(root,"perUse",money(perUse));
    setText(root,"perWeek",money(perWeek));
    setText(root,"perMonth",money(perMonth));
    setText(root,"perYear",money(perYear));
    const annualUses = frequency==="day" ? uses*365 : uses*52;
    setText(root,"annualUses",Math.round(annualUses).toLocaleString("en-GB"));
    setText(root,"annualKwh",(kwhPerUse*annualUses).toFixed(1)+" kWh");
    setText(root,"kwhPerUse",kwhPerUse.toFixed(3)+" kWh");
    showResults(root);
  }

  function calculatePowerHours(form, root){
    const rateP = num(form,"rate");
    const watts = num(form,"watts");
    const hours = num(form,"hoursDay");
    const days = num(form,"daysWeek");
    const kwhDay=(watts/1000)*hours;
    const costDay=kwhDay*(rateP/100);
    const perWeek=costDay*days;
    const perMonth=perWeek*52/12;
    const perYear=perWeek*52;

    setText(root,"perUse",money(costDay));
    setText(root,"perWeek",money(perWeek));
    setText(root,"perMonth",money(perMonth));
    setText(root,"perYear",money(perYear));
    setText(root,"annualUses",Math.round(days*52).toLocaleString("en-GB")+" active days");
    setText(root,"annualKwh",(kwhDay*days*52).toFixed(1)+" kWh");
    showResults(root);
  }

  function calculateEV(form, root){
    const rateP=num(form,"rate");
    const battery=num(form,"battery");
    const added=num(form,"added");
    const efficiency=Math.max(1,num(form,"efficiency"))/100;
    const usesWeek=num(form,"usesWeek");
    const energyFromGrid=(battery*(added/100))/efficiency;
    const perCharge=energyFromGrid*(rateP/100);
    const perWeek=perCharge*usesWeek;
    const perMonth=perWeek*52/12;
    const perYear=perWeek*52;
    setText(root,"perUse",money(perCharge));
    setText(root,"perWeek",money(perWeek));
    setText(root,"perMonth",money(perMonth));
    setText(root,"perYear",money(perYear));
    setText(root,"annualUses",Math.round(usesWeek*52).toLocaleString("en-GB")+" charging sessions");
    setText(root,"annualKwh",(energyFromGrid*usesWeek*52).toFixed(1)+" kWh");
    setText(root,"energyPerCharge",energyFromGrid.toFixed(1)+" kWh");
    showResults(root);
  }

  document.querySelectorAll("[data-calculator]").forEach(root=>{
    const form=root.querySelector("form");
    if(!form) return;
    form.addEventListener("submit",e=>{
      e.preventDefault();
      const kind=root.dataset.calculator;
      if(kind==="cycle") calculateCycle(form,root);
      if(kind==="power-day") calculatePowerUses(form,root,"day");
      if(kind==="power-week") calculatePowerUses(form,root,"week");
      if(kind==="power-hours") calculatePowerHours(form,root);
      if(kind==="ev") calculateEV(form,root);
    });
    form.dispatchEvent(new Event("submit",{cancelable:true,bubbles:true}));
  });
})();
