function loadDashboard(){

const cases = DB.load("cases");
const warrants = DB.load("warrants");
const hearings = DB.load("hearings");

document.getElementById("openCases").textContent =
cases.length;

document.getElementById("pendingWarrants").textContent =
warrants.filter(
w=>w.status==="Pending"
).length;

document.getElementById("hearingCount").textContent =
hearings.length;

const feed =
document.getElementById("activityFeed");

feed.innerHTML = "";

const activity =
DB.load("activity");

activity.slice(-10).reverse().forEach(item=>{

const li =
document.createElement("li");

li.textContent = item;

feed.appendChild(li);

});

}

document.addEventListener(
"DOMContentLoaded",
loadDashboard
);
