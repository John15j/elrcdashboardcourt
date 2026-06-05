const Cases = {

  generateId(){
    const cases = Storage.get("cases");
    return `CASE-${2026}-${String(cases.length+1).padStart(4,"0")}`;
  },

  create(caseData){

    const cases = Storage.get("cases");

    const newCase = {

      id: Cases.generateId(),

      title: caseData.title || "Untitled Case",

      defendant: caseData.defendant || null,

      officers: caseData.officers || [],

      witnesses: caseData.witnesses || [],

      charges: caseData.charges || [],

      evidence: caseData.evidence || [],

      status: "open",

      courtDate: caseData.courtDate || null,

      notes: "",

      timeline: [
        {
          event:"Case Created",
          time:new Date().toLocaleString()
        }
      ]

    };

    cases.push(newCase);

    Storage.set("cases",cases);

    DB.log(`Case created: ${newCase.id}`);

    return newCase;

  },

  update(id,updates){

    const cases = Storage.get("cases");

    const index =
      cases.findIndex(c=>c.id===id);

    if(index===-1) return;

    cases[index] = {
      ...cases[index],
      ...updates
    };

    cases[index].timeline.push({
      event:"Case Updated",
      time:new Date().toLocaleString()
    });

    Storage.set("cases",cases);

    DB.log(`Case updated: ${id}`);

  },

  delete(id){

    let cases =
      Storage.get("cases");

    cases =
      cases.filter(c=>c.id!==id);

    Storage.set("cases",cases);

    DB.log(`Case deleted: ${id}`);

  },

  getAll(){
    return Storage.get("cases");
  }

};
