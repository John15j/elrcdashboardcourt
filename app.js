
let chart;

function show(id){
document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
document.getElementById(id).classList.add('active');
}

function init(){
renderCases();
renderDefendants();
renderEvidence();
updateStats();
initChart();
}

function renderCases(){
let search = document.getElementById("searchCases")?.value || "";
document.getElementById("caseList").innerHTML =
db.cases
.filter(c=>c.title.toLowerCase().includes(search.toLowerCase()))
.map(c=>`<div class='item'><b>${c.title}</b><br>${c.status}</div>`).join("");
}

function addCase(){
let t = prompt("Case title");
let s = prompt("Status");
db.cases.push({title:t,status:s});
updateAll();
}

function renderDefendants(){
document.getElementById("defList").innerHTML =
db.defendants.map(d=>`<div class='item'>${d.name} → ${d.case}</div>`).join("");
}

function addDefendant(){
let n = prompt("Name");
let c = prompt("Case");
db.defendants.push({name:n,case:c});
updateAll();
}

function renderEvidence(){
document.getElementById("evList").innerHTML =
db.evidence.map(e=>`<div class='item'>${e.title}</div>`).join("");
}

function addEvidence(){
let e = prompt("Evidence");
db.evidence.push({title:e});
updateAll();
}

function runAI(){
let text = facts.value.toLowerCase();
let score = 0;

if(text.includes("robbery")) score += 80;
if(text.includes("weapon")) score += 40;
if(text.includes("fraud")) score += 60;
if(text.includes("murder")) score += 100;

let result = score>=100?"Severe Felony":
score>=60?"Felony":"Misdemeanor";

document.getElementById("aiOut").innerHTML =
`Score: ${score}<br>${result}`;
}

function updateStats(){
document.getElementById("caseCount").innerText = db.cases.length;
document.getElementById("defCount").innerText = db.defendants.length;
document.getElementById("evCount").innerText = db.evidence.length;
if(chart){
chart.data.datasets[0].data=[db.cases.length,db.defendants.length];
chart.update();
}
}

function initChart(){
chart=new Chart(document.getElementById("chart"),{
type:"bar",
data:{labels:["Cases","Defendants"],datasets:[{data:[0,0],backgroundColor:["#3b82f6","#22c55e"]}]}
});
}

function updateAll(){
renderCases();
renderDefendants();
renderEvidence();
updateStats();
}

init();
