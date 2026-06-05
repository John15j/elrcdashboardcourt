const Storage = {

  get(key){
    try{
      return JSON.parse(localStorage.getItem(key)) || [];
    }catch{
      return [];
    }
  },

  set(key,data){
    localStorage.setItem(
      key,
      JSON.stringify(data)
    );
  },

  remove(key){
    localStorage.removeItem(key);
  },

  export(){

    const backup = {};

    for(let i=0;i<localStorage.length;i++){

      const key =
        localStorage.key(i);

      backup[key] =
        localStorage.getItem(key);

    }

    return backup;
  },

  import(data){

    Object.keys(data).forEach(key=>{

      localStorage.setItem(
        key,
        data[key]
      );

    });

  }

};
