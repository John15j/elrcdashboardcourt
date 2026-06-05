const Router = {

  init(){

    const buttons =
      document.querySelectorAll(
        ".nav-btn"
      );

    buttons.forEach(btn=>{

      btn.addEventListener(
        "click",
        ()=>{

          Router.navigate(
            btn.dataset.page
          );

        }
      );

    });

  },

  navigate(page){

    document
      .querySelectorAll(".page")
      .forEach(p=>{

        p.classList.remove(
          "active"
        );

      });

    document
      .querySelectorAll(".nav-btn")
      .forEach(btn=>{

        btn.classList.remove(
          "active"
        );

      });

    const target =
      document.getElementById(
        page + "Page"
      );

    if(target){

      target.classList.add(
        "active"
      );

    }

    const activeBtn =
      document.querySelector(
        `[data-page="${page}"]`
      );

    if(activeBtn){

      activeBtn.classList.add(
        "active"
      );

    }

  }

};
