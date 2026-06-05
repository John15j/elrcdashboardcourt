const Modal = {

  open(content){

    const container =
      document.getElementById(
        "modalContainer"
      );

    container.innerHTML = `

      <div class="modal-overlay">

        <div class="modal-window">

          <button
          class="close-modal">

          ✕

          </button>

          ${content}

        </div>

      </div>

    `;

    document
      .querySelector(
        ".close-modal"
      )
      .onclick =
      Modal.close;

  },

  close(){

    document
      .getElementById(
        "modalContainer"
      )
      .innerHTML = "";

  }

};
