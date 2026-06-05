const Dashboard = {

  load(){

    const cases =
      Storage.get("cases");

    const hearings =
      Storage.get("hearings");

    const defendants =
      Storage.get("defendants");

    document
      .getElementById(
        "openCases"
      )
      .textContent =
      cases.length;

    document
      .getElementById(
        "pendingHearings"
      )
      .textContent =
      hearings.length;

    document
      .getElementById(
        "defendantCount"
      )
      .textContent =
      defendants.length;

    document
      .getElementById(
        "convictionRate"
      )
      .textContent =
      "0%";

    Dashboard.loadActivity();

  },

  loadActivity(){

    const activity =
      Storage.get("activity");

    const feed =
      document.getElementById(
        "activityFeed"
      );

    if(!feed) return;

    feed.innerHTML = "";

    activity
      .slice(-15)
      .reverse()
      .forEach(item=>{

        const row =
          document.createElement(
            "div"
          );

        row.innerHTML = `

          <strong>
          ${item.message}
          </strong>

          <br>

          <small>
          ${item.date}
          </small>

        `;

        feed.appendChild(row);

      });

  }

};
