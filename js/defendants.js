const Defendants = {

  generateId(){
    const list =
      Storage.get("defendants");

    return `DEF-${String(list.length+1).padStart(4,"0")}`;
  },

  create(data){

    const list =
      Storage.get("defendants");

    const defendant = {

      id: Defendants.generateId(),

      name: data.name,

      dob: data.dob || null,

      notes: data.notes || "",

      cases: []

    };

    list.push(defendant);

    Storage.set("defendants",list);

    DB.log(`Defendant created: ${defendant.id}`);

    return defendant;

  },

  linkCase(defendantId,caseId){

    const list =
      Storage.get("defendants");

    const d =
      list.find(x=>x.id===defendantId);

    if(!d) return;

    if(!d.cases.includes(caseId)){
      d.cases.push(caseId);
    }

    Storage.set("defendants",list);

  },

  getAll(){
    return Storage.get("defendants");
  }

};
