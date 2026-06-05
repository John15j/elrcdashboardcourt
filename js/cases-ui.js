const CasesUI = {

  init(){

    document
      .getElementById("createCaseBtn")
      .onclick = CasesUI.openCreateModal;

    CasesUI.render();

  },

  render(){

    const container =
      document.getElementById("casesTable");

    const cases = Cases.getAll();

    container.innerHTML = "";

    if(cases.length === 0){
      container.innerHTML =
        "<p>No cases found.</p>";
      return;
    }

    cases.forEach(c => {

      const row = document.createElement("div");

      row.className = "card";

      row.innerHTML = `

        <h3>${c.id}</h3>
        <p><b>${c.title}</b></p>

        <p>Status: ${c.status}</p>

        <button onclick="CasesUI.openReview('${c.id}')">
          Open Review
        </button>

        <button onclick="CasesUI.edit('${c.id}')">
          Edit
        </button>

        <button onclick="CasesUI.remove('${c.id}')">
          Delete
        </button>

      `;

      container.appendChild(row);

    });

  },

  openCreateModal(){

    const defendants = Defendants.getAll();
    const officers = Officers.getAll();

    Modal.open(`

      <h2>Create Case</h2>

      <input id="caseTitle" placeholder="Case Title" />

      <h4>Defendant</h4>
      <select id="caseDefendant">

        <option value="">Select</option>

        ${defendants.map(d =>
          `<option value="${d.id}">
            ${d.name}
          </option>`
        ).join("")}

      </select>

      <h4>Officers</h4>

      <div id="officerList">

        ${officers.map(o => `
          <label>
            <input type="checkbox" value="${o.id}">
            ${o.name}
          </label>
        `).join("")}

      </div>

      <br/>

      <button onclick="CasesUI.saveCreate()">
        Create Case
      </button>

    `);

  },

  saveCreate(){

    const title =
      document.getElementById("caseTitle").value;

    const defendant =
      document.getElementById("caseDefendant").value;

    const officers = [...document.querySelectorAll("#officerList input:checked")]
      .map(i => i.value);

    const newCase = Cases.create({
      title,
      defendant,
      officers
    });

    if(defendant){
      Defendants.linkCase(defendant,newCase.id);
    }

    officers.forEach(o=>{
      Officers.linkCase(o,newCase.id);
    });

    Modal.close();

    CasesUI.render();

    Dashboard.load();

  },

  remove(id){

    if(confirm("Delete this case?")){

      Cases.delete(id);

      CasesUI.render();

      Dashboard.load();

    }

  },

  edit(id){

    const cases = Cases.getAll();
    const c = cases.find(x=>x.id===id);

    Modal.open(`

      <h2>Edit Case</h2>

      <input id="editTitle" value="${c.title}" />

      <select id="editStatus">

        <option ${c.status==="open"?"selected":""}>
          open
        </option>

        <option ${c.status==="closed"?"selected":""}>
          closed
        </option>

        <option ${c.status==="pending"?"selected":""}>
          pending
        </option>

      </select>

      <button onclick="CasesUI.saveEdit('${id}')">
        Save
      </button>

    `);

  },

  saveEdit(id){

    const title =
      document.getElementById("editTitle").value;

    const status =
      document.getElementById("editStatus").value;

    Cases.update(id,{ title, status });

    Modal.close();

    CasesUI.render();

    Dashboard.load();

  },

  openReview(id){

    const cases = Cases.getAll();
    const c = cases.find(x=>x.id===id);

    const ai = AI.analyzeCase(id);

    Modal.open(`

      <h2>Case Review</h2>

      <p><b>${c.id}</b></p>
      <p>${c.title}</p>

      <hr/>

      <h3>AI Analysis</h3>

      <p>Confidence: ${ai.confidence}%</p>

      <p>Charges:</p>
      <ul>
        ${ai.recommendedCharges.map(x=>`<li>${x}</li>`).join("")}
      </ul>

      <p>Fine: ${ai.fine}</p>
      <p>Jail: ${ai.jail}</p>

      <hr/>

      <button onclick="CasesUI.launchCourt('${id}')">
        Launch Courtroom
      </button>

    `);

  },

  launchCourt(id){

    localStorage.setItem("activeCase",id);

    Router.navigate("courtroom");

    Courtroom.load(id);

    Modal.close();

  }

};
