/* ================================================= */
/* GFBI — Greenville Federal Bureau of Investigation */
/* ================================================= */

let suspects = JSON.parse(localStorage.getItem("gfbi_suspects")) || [];
let gfbiCases = JSON.parse(localStorage.getItem("gfbi_cases")) || [];
let currentSuspectId = null;
let currentCaseId = null;

/* ================================================= */
/* CLOCK */
/* ================================================= */

function updateClock(){
    const clock = document.getElementById("clock");
    if(!clock) return;
    clock.innerText = new Date().toLocaleTimeString();
}

setInterval(updateClock, 1000);
updateClock();

/* ================================================= */
/* NAVIGATION */
/* ================================================= */

function showPage(page){

    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
        p.classList.add("hidden");
    });

    document.querySelectorAll(".nav-btn").forEach(b => {
        b.classList.remove("active");
    });

    const target = document.getElementById("page-" + page);
    if(target){
        target.classList.remove("hidden");
        target.classList.add("active");
    }

    const navMap = {
        dashboard: 0,
        suspects: 1,
        cases: 2,
        agents: 3
    };

    const navBtns = document.querySelectorAll(".nav-btn");
    if(navMap[page] !== undefined){
        navBtns[navMap[page]].classList.add("active");
    }

    if(page === "suspects") renderSuspects();
    if(page === "cases") renderCases();
    if(page === "dashboard") updateDashboard();
    if(page === "agents") updateAgentStats();
}

/* ================================================= */
/* POPUPS */
/* ================================================= */

function openPopup(name){
    document.getElementById("popup-" + name)
        .classList.remove("hidden");
}

function closePopup(name){
    document.getElementById("popup-" + name)
        .classList.add("hidden");
}

/* ================================================= */
/* ACTIVITY LOG */
/* ================================================= */

function logActivity(text){

    const feed = document.getElementById("activityFeed");
    if(!feed) return;

    const empty = feed.querySelector(".feed-empty");
    if(empty) empty.remove();

    const item = document.createElement("div");
    item.className = "feed-item";
    item.innerHTML =
        "<span style='color:#94a3b8;font-size:11px'>" +
        new Date().toLocaleTimeString() +
        "</span> — " + text;

    feed.prepend(item);

    const items = feed.querySelectorAll(".feed-item");
    if(items.length > 10){
        items[items.length - 1].remove();
    }
}

/* ================================================= */
/* DASHBOARD */
/* ================================================= */

function updateDashboard(){

    document.getElementById("statSuspects").textContent = suspects.length;
    document.getElementById("statCases").textContent = gfbiCases.length;
    document.getElementById("statActive").textContent =
        gfbiCases.filter(c => c.status === "ACTIVE").length;
    document.getElementById("statHighThreat").textContent =
        suspects.filter(s => s.threat === "HIGH" || s.threat === "EXTREME").length;

    const recentSuspectsEl = document.getElementById("recentSuspects");
    recentSuspectsEl.innerHTML = "";

    if(suspects.length === 0){
        recentSuspectsEl.innerHTML = "<div class='feed-empty'>No suspects on file.</div>";
    } else {
        suspects.slice(-5).reverse().forEach(s => {
            const div = document.createElement("div");
            div.className = "feed-item";
            div.style.cursor = "pointer";
            div.innerHTML =
                "<b>" + s.name + "</b> — " +
                "<span class='threat-badge threat-" + s.threat + "'>" + s.threat + "</span>";
            div.onclick = () => openSuspectProfile(s.id);
            recentSuspectsEl.appendChild(div);
        });
    }

    const activeCasesEl = document.getElementById("activeCasesFeed");
    activeCasesEl.innerHTML = "";

    const activeCases = gfbiCases.filter(c => c.status === "ACTIVE" || c.status === "OPEN");

    if(activeCases.length === 0){
        activeCasesEl.innerHTML = "<div class='feed-empty'>No active cases.</div>";
    } else {
        activeCases.slice(-5).reverse().forEach(c => {
            const div = document.createElement("div");
            div.className = "feed-item";
            div.style.cursor = "pointer";
            div.innerHTML =
                "<b>" + c.title + "</b> — " +
                "<span class='case-status-" + c.status.toLowerCase() + "'>" + c.status + "</span>";
            div.onclick = () => openCaseFile(c.id);
            activeCasesEl.appendChild(div);
        });
    }
}

/* ================================================= */
/* SUSPECTS */
/* ================================================= */

function saveSuspect(){

    const name = document.getElementById("sName").value.trim();
    const username = document.getElementById("sUsername").value.trim();

    if(!name || !username){
        alert("Name and Username are required.");
        return;
    }

    const suspect = {
        id: "GFBI-S-" + Date.now(),
        name: name,
        username: username,
        age: document.getElementById("sAge").value,
        address: document.getElementById("sAddress").value,
        threat: document.getElementById("sThreat").value,
        status: document.getElementById("sStatus").value,
        charges: document.getElementById("sCharges").value,
        notes: document.getElementById("sNotes").value,
        linkedCases: [],
        dateAdded: new Date().toLocaleDateString()
    };

    suspects.push(suspect);
    localStorage.setItem("gfbi_suspects", JSON.stringify(suspects));

    closePopup("addSuspect");

    document.getElementById("sName").value = "";
    document.getElementById("sUsername").value = "";
    document.getElementById("sAge").value = "";
    document.getElementById("sAddress").value = "";
    document.getElementById("sCharges").value = "";
    document.getElementById("sNotes").value = "";

    logActivity("Suspect added: " + name);
    updateDashboard();
    renderSuspects();
}

function renderSuspects(){

    const grid = document.getElementById("suspectGrid");
    if(!grid) return;

    const search = (document.getElementById("suspectSearch")?.value || "").toLowerCase();
    const filter = document.getElementById("suspectFilter")?.value || "all";

    let filtered = suspects.filter(s => {
        const matchSearch =
            s.name.toLowerCase().includes(search) ||
            s.username.toLowerCase().includes(search);
        const matchFilter = filter === "all" || s.threat === filter;
        return matchSearch && matchFilter;
    });

    grid.innerHTML = "";

    if(filtered.length === 0){
        grid.innerHTML = "<div style='color:#94a3b8;padding:20px'>No suspects found.</div>";
        return;
    }

    filtered.forEach(s => {
        const card = document.createElement("div");
        card.className = "suspect-card";
        card.innerHTML = `
            <div class="suspect-card-top">
                <div class="suspect-avatar">👤</div>
                <div>
                    <div class="suspect-card-name">${s.name}</div>
                    <div class="suspect-card-username">@${s.username}</div>
                </div>
            </div>
            <div class="suspect-card-meta">
                <span class="threat-badge threat-${s.threat}">${s.threat}</span>
                <span class="status-badge-small">${s.status}</span>
            </div>
        `;
        card.onclick = () => openSuspectProfile(s.id);
        grid.appendChild(card);
    });
}

function openSuspectProfile(id){

    currentSuspectId = id;
    const s = suspects.find(x => x.id === id);
    if(!s) return;

    document.getElementById("profileName").textContent = s.name;
    document.getElementById("profileId").textContent = s.id;
    document.getElementById("profileFullName").textContent = s.name;
    document.getElementById("profileUsername").textContent = "@" + s.username;
    document.getElementById("profileAge").textContent = s.age || "—";
    document.getElementById("profileAddress").textContent = s.address || "—";
    document.getElementById("profileCharges").textContent = s.charges || "No charges on record.";
    document.getElementById("profileNotes").textContent = s.notes || "No notes.";

    const threatEl = document.getElementById("profileThreat");
    threatEl.textContent = s.threat;
    threatEl.className = "threat-badge threat-" + s.threat;

    document.getElementById("profileStatus").textContent = s.status;

    const linkedEl = document.getElementById("profileLinkedCases");
    linkedEl.innerHTML = "";

    if(s.linkedCases && s.linkedCases.length > 0){
        s.linkedCases.forEach(cid => {
            const c = gfbiCases.find(x => x.id === cid);
            if(c){
                const div = document.createElement("div");
                div.className = "linked-item";
                div.textContent = c.title + " — " + c.id;
                div.onclick = () => openCaseFile(c.id);
                linkedEl.appendChild(div);
            }
        });
    } else {
        linkedEl.innerHTML = "<div style='color:#94a3b8;font-size:13px'>No linked cases.</div>";
    }

    showPage("suspectProfile");
}

function editCurrentSuspect(){

    const s = suspects.find(x => x.id === currentSuspectId);
    if(!s) return;

    document.getElementById("esName").value = s.name;
    document.getElementById("esUsername").value = s.username;
    document.getElementById("esAge").value = s.age || "";
    document.getElementById("esAddress").value = s.address || "";
    document.getElementById("esThreat").value = s.threat;
    document.getElementById("esStatus").value = s.status;
    document.getElementById("esCharges").value = s.charges || "";
    document.getElementById("esNotes").value = s.notes || "";

    openPopup("editSuspect");
}

function updateSuspect(){

    const s = suspects.find(x => x.id === currentSuspectId);
    if(!s) return;

    s.name = document.getElementById("esName").value.trim();
    s.username = document.getElementById("esUsername").value.trim();
    s.age = document.getElementById("esAge").value;
    s.address = document.getElementById("esAddress").value;
    s.threat = document.getElementById("esThreat").value;
    s.status = document.getElementById("esStatus").value;
    s.charges = document.getElementById("esCharges").value;
    s.notes = document.getElementById("esNotes").value;

    localStorage.setItem("gfbi_suspects", JSON.stringify(suspects));

    closePopup("editSuspect");
    logActivity("Suspect updated: " + s.name);
    openSuspectProfile(currentSuspectId);
}

function deleteCurrentSuspect(){

    const s = suspects.find(x => x.id === currentSuspectId);
    if(!s) return;

    if(!confirm("Delete suspect " + s.name + "? This cannot be undone.")) return;

    suspects = suspects.filter(x => x.id !== currentSuspectId);
    localStorage.setItem("gfbi_suspects", JSON.stringify(suspects));

    logActivity("Suspect deleted: " + s.name);
    updateDashboard();
    showPage("suspects");
}

/* ================================================= */
/* CASES */
/* ================================================= */

function saveCase(){

    const title = document.getElementById("cTitle").value.trim();

    if(!title){
        alert("Case title is required.");
        return;
    }

    const newCase = {
        id: "GFBI-C-" + Date.now(),
        title: title,
        agent: document.getElementById("cAgent").value,
        status: document.getElementById("cStatus").value,
        priority: document.getElementById("cPriority").value,
        description: document.getElementById("cDesc").value,
        evidence: document.getElementById("cEvidence").value,
        notes: document.getElementById("cNotes").value,
        linkedSuspects: [],
        dateOpened: new Date().toLocaleDateString()
    };

    gfbiCases.push(newCase);
    localStorage.setItem("gfbi_cases", JSON.stringify(gfbiCases));

    closePopup("addCase");

    document.getElementById("cTitle").value = "";
    document.getElementById("cAgent").value = "";
    document.getElementById("cDesc").value = "";
    document.getElementById("cEvidence").value = "";
    document.getElementById("cNotes").value = "";

    logActivity("Case opened: " + title);
    updateDashboard();
    renderCases();
}

function renderCases(){

    const grid = document.getElementById("caseGrid");
    if(!grid) return;

    const search = (document.getElementById("caseSearch")?.value || "").toLowerCase();
    const filter = document.getElementById("caseFilter")?.value || "all";

    let filtered = gfbiCases.filter(c => {
        const matchSearch = c.title.toLowerCase().includes(search) ||
            c.id.toLowerCase().includes(search);
        const matchFilter = filter === "all" || c.status === filter;
        return matchSearch && matchFilter;
    });

    grid.innerHTML = "";

    if(filtered.length === 0){
        grid.innerHTML = "<div style='color:#94a3b8;padding:20px'>No cases found.</div>";
        return;
    }

    filtered.forEach(c => {
        const card = document.createElement("div");
        card.className = "case-card";
        card.innerHTML = `
            <div class="case-card-title">${c.title}</div>
            <div class="case-card-id">${c.id}</div>
            <div class="case-card-meta">
                <span class="case-status-${c.status.toLowerCase()}">${c.status}</span>
                <span class="priority-badge">${c.priority}</span>
            </div>
        `;
        card.onclick = () => openCaseFile(c.id);
        grid.appendChild(card);
    });
}

function openCaseFile(id){

    currentCaseId = id;
    const c = gfbiCases.find(x => x.id === id);
    if(!c) return;

    document.getElementById("caseFileName").textContent = c.title;
    document.getElementById("caseFileId").textContent = c.id;
    document.getElementById("caseFileTitle").textContent = c.title;
    document.getElementById("caseFileAgent").textContent = c.agent || "Unassigned";
    document.getElementById("caseFileDesc").textContent = c.description || "No description.";
    document.getElementById("caseFileEvidence").textContent = c.evidence || "No evidence logged.";
    document.getElementById("caseFileNotes").textContent = c.notes || "No notes.";
    document.getElementById("caseFileDate").textContent = c.dateOpened || "—";
    document.getElementById("caseFilePriority").textContent = c.priority;

    const statusEl = document.getElementById("caseFileStatus");
    statusEl.textContent = c.status;
    statusEl.className = "case-status-" + c.status.toLowerCase();

    const linkedEl = document.getElementById("caseFileLinkedSuspects");
    linkedEl.innerHTML = "";

    if(c.linkedSuspects && c.linkedSuspects.length > 0){
        c.linkedSuspects.forEach(sid => {
            const s = suspects.find(x => x.id === sid);
            if(s){
                const div = document.createElement("div");
                div.className = "linked-item";
                div.textContent = s.name + " — @" + s.username;
                div.onclick = () => openSuspectProfile(s.id);
                linkedEl.appendChild(div);
            }
        });
    } else {
        linkedEl.innerHTML = "<div style='color:#94a3b8;font-size:13px'>No linked suspects.</div>";
    }

    showPage("caseFile");
}

function updateCaseStatus(status){

    const c = gfbiCases.find(x => x.id === currentCaseId);
    if(!c) return;

    c.status = status;
    localStorage.setItem("gfbi_cases", JSON.stringify(gfbiCases));

    const statusEl = document.getElementById("caseFileStatus");
    statusEl.textContent = status;
    statusEl.className = "case-status-" + status.toLowerCase();

    logActivity("Case status updated: " + c.title + " → " + status);
    updateDashboard();
}

function editCurrentCase(){

    const c = gfbiCases.find(x => x.id === currentCaseId);
    if(!c) return;

    document.getElementById("ecTitle").value = c.title;
    document.getElementById("ecAgent").value = c.agent || "";
    document.getElementById("ecStatus").value = c.status;
    document.getElementById("ecPriority").value = c.priority;
    document.getElementById("ecDesc").value = c.description || "";
    document.getElementById("ecEvidence").value = c.evidence || "";
    document.getElementById("ecNotes").value = c.notes || "";

    openPopup("editCase");
}

function updateCase(){

    const c = gfbiCases.find(x => x.id === currentCaseId);
    if(!c) return;

    c.title = document.getElementById("ecTitle").value.trim();
    c.agent = document.getElementById("ecAgent").value;
    c.status = document.getElementById("ecStatus").value;
    c.priority = document.getElementById("ecPriority").value;
    c.description = document.getElementById("ecDesc").value;
    c.evidence = document.getElementById("ecEvidence").value;
    c.notes = document.getElementById("ecNotes").value;

    localStorage.setItem("gfbi_cases", JSON.stringify(gfbiCases));

    closePopup("editCase");
    logActivity("Case updated: " + c.title);
    openCaseFile(currentCaseId);
}

function deleteCurrentCase(){

    const c = gfbiCases.find(x => x.id === currentCaseId);
    if(!c) return;

    if(!confirm("Delete case " + c.title + "? This cannot be undone.")) return;

    gfbiCases = gfbiCases.filter(x => x.id !== currentCaseId);
    localStorage.setItem("gfbi_cases", JSON.stringify(gfbiCases));

    logActivity("Case deleted: " + c.title);
    updateDashboard();
    showPage("cases");
}

/* ================================================= */
/* AGENT STATS */
/* ================================================= */

function updateAgentStats(){
    document.getElementById("agentCases").textContent = gfbiCases.length;
    document.getElementById("agentSuspects").textContent = suspects.length;
    document.getElementById("agentClosed").textContent =
        gfbiCases.filter(c => c.status === "CLOSED").length;
    document.getElementById("agentActive").textContent =
        gfbiCases.filter(c => c.status === "ACTIVE").length;
}

/* ================================================= */
/* INIT */
/* ================================================= */

updateDashboard();