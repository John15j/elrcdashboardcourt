document.addEventListener(
  "DOMContentLoaded",
  ()=>{

    DB.initialize();

    Router.init();

    Dashboard.load();

    console.log(
      "ERLC JMS Loaded"
    );

  }
);
