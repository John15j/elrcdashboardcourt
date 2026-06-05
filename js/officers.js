const Officers = {

  generateId(){

    const list =
      Storage.get("officers");

    return `OFF-${String(list.length+1).padStart(4,"0")}`;

  },

  create(data){

    const list =
      Storage.get("officers");

    const officer = {

      id: Officers.generateId(),

      name: data.name,

      department: data.department || "Unknown",

      rank: data.rank || "",

      cases: []

    };

    list.push(officer);

    Storage.set("officers",list);

    DB.log(`Officer created: ${officer.id}`);

    return officer;

  },

  linkCase(officerId,caseId){

    const list =
      Storage.get("officers");

    const o =
      list.find(x=>x.id===officerId);

    if(!o) return;

    if(!o.cases.includes(caseId)){
      o.cases.push(caseId);
    }

    Storage.set("officers",list);

  },

  getAll(){
    return Storage.get("officers");
  }

};
