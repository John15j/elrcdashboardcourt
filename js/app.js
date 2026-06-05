document.addEventListener("DOMContentLoaded", () => {

  DB.initialize();

  Router.init();

  Dashboard.load();

  CasesUI.init();

  console.log("ERLC Court System Online");

});
