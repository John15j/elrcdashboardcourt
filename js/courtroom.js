const Courtroom = {

  load(caseId){

    const cases = Cases.getAll();
    const c = cases.find(x=>x.id===caseId);

    if(!c) return;

    document.getElementById("courtCaseInfo").innerHTML = `

      <h3>${c.id}</h3>
      <p>${c.title}</p>
      <p>Status: ${c.status}</p>

    `;

    const defendants = Defendants.getAll();
    const officers = Officers.getAll();

    const d = defendants.find(x=>x.id===c.defendant);

    document.getElementById("courtPeople").innerHTML = `

      <h4>Defendant</h4>
      <p>${d ? d.name : "None"}</p>

      <h4>Officers</h4>
      ${c.officers.map(id=>{
        const o = officers.find(x=>x.id===id);
        return `<p>${o ? o.name : "Unknown"}</p>`;
      }).join("")}

    `;

  }

};
