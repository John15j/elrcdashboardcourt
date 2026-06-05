const Hearings = {

  generateId(){

    const list =
      Storage.get("hearings");

    return `HEAR-${String(list.length+1).padStart(4,"0")}`;

  },

  create(data){

    const list =
      Storage.get("hearings");

    const hearing = {

      id: Hearings.generateId(),

      caseId: data.caseId,

      date: data.date,

      status: "scheduled",

      notes: "",

      log:[
        {
          event:"Hearing Scheduled",
          time:new Date().toLocaleString()
        }
      ]

    };

    list.push(hearing);

    Storage.set("hearings",list);

    DB.log(`Hearing created: ${hearing.id}`);

    return hearing;

  },

  updateStatus(id,status){

    const list =
      Storage.get("hearings");

    const h =
      list.find(x=>x.id===id);

    if(!h) return;

    h.status = status;

    h.log.push({
      event:`Status changed to ${status}`,
      time:new Date().toLocaleString()
    });

    Storage.set("hearings",list);

  },

  getAll(){
    return Storage.get("hearings");
  }

};
