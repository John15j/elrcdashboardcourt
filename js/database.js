const DB = {

  initialize(){

    const defaults = {

      cases:[],
      defendants:[],
      officers:[],
      hearings:[],
      documents:[],
      penalCode:[],
      activity:[]

    };

    Object.entries(defaults)
      .forEach(([key,val])=>{

        if(
          !localStorage.getItem(key)
        ){
          Storage.set(key,val);
        }

      });

  },

  log(message){

    const activity =
      Storage.get("activity");

    activity.push({

      message,

      date:
      new Date().toLocaleString()

    });

    Storage.set(
      "activity",
      activity
    );

  }

};
