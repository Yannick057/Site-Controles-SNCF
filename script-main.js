function resumeOps(arr) {
    const map = {};
    arr.forEach(b => {
        let m = b.montant !== undefined ? b.montant : (b.amount !== undefined ? b.amount : "");
        let k = b.type + ' ' + m;
        map[k] = (map[k] || 0) + 1;
    });
    return Object.entries(map).map(([label, n]) => `${n} ${label}€`).join(', ');
}

let controles = JSON.parse(localStorage.getItem('controles')) || [];
let billetsExceptionnels = [];
let billetsControles = [];
let pvs = [];
let editingIndex = null;
let currentSort = { column: 'date', ascending: false };

// Compteurs pour STT rapide
let sttControleCounter = 0;
let sttPVCounter = 0;

function updateSTTControle(delta) {
    sttControleCounter = Math.max(0, sttControleCounter + delta);
    document.getElementById('sttControleCount').textContent = sttControleCounter;
}

function updateSTTPV(delta) {
    sttPVCounter = Math.max(0, sttPVCounter + delta);
    document.getElementById('sttPVCount').textContent = sttPVCounter;
}

function ajouterBilletExceptionnel() {
    billetsExceptionnels.push({type: 'Bord', montant: 0});
    afficherBilletsExceptionnels();
}
function supprimerBilletExceptionnel(i) {
    billetsExceptionnels.splice(i, 1);
    afficherBilletsExceptionnels();
}
function afficherBilletsExceptionnels() {
    const container = document.getElementById("billetsExceptionnels");
    container.innerHTML = '';
    billetsExceptionnels.forEach((item, i) => {
        container.innerHTML += `
            <div class="input-group dynamic-row">
                <label>Type</label>
                <select onchange="billetsExceptionnels[${i}].type=this.value">
                    <option value="Exceptionnel"${item.type==="Exceptionnel"?" selected":""}>Exceptionnel</option>
                    <option value="Bord"${item.type==="Bord"?" selected":""}>Bord</option>
                </select>
                <label>Montant (€)</label>
                <input type="number" placeholder="Montant (€)" min="0" onchange="billetsExceptionnels[${i}].montant=this.value" value="${item.montant}">
                <button type="button" onclick="supprimerBilletExceptionnel(${i})" class="del-btn">🗑️</button>
            </div>
        `;
    });
}

function ajouterBilletControle() {
    billetsControles.push({type: 'STT', montant: 50});
    afficherBilletsControles();
}
function supprimerBilletControle(i) {
    billetsControles.splice(i, 1);
    afficherBilletsControles();
}
function afficherBilletsControles() {
    const container = document.getElementById("billetsControles");
    container.innerHTML = '';
    billetsControles.forEach((item, i) => {
        container.innerHTML += `
            <div class="input-group dynamic-row">
                <label>Type</label>
                <select onchange="billetsControles[${i}].type=this.value">
                    <option value="STT"${item.type==="STT"?" selected":""}>STT</option>
                    <option value="RNV"${item.type==="RNV"?" selected":""}>RNV</option>
                    <option value="Titre tiers"${item.type==="Titre tiers"?" selected":""}>Titre tiers</option>
                    <option value="Date naissance"${item.type==="Date naissance"?" selected":""}>Date naissance</option>
                    <option value="Autre"${item.type==="Autre"?" selected":""}>Autre</option>
                </select>
                <label>Montant (€)</label>
                <input type="number" placeholder="Montant (€)" min="0" onchange="billetsControles[${i}].montant=this.value" value="${item.montant}">
                <button type="button" onclick="supprimerBilletControle(${i})" class="del-btn">🗑️</button>
            </div>
        `;
    });
}

function ajouterPV() {
    pvs.push({type: 'STT', montant: 100});
    afficherPvs();
}
function supprimerPV(i) {
    pvs.splice(i, 1);
    afficherPvs();
}
function afficherPvs() {
    const container = document.getElementById("pvs");
    container.innerHTML = '';
    pvs.forEach((item, i) => {
        container.innerHTML += `
            <div class="input-group dynamic-row">
                <label>Type</label>
                <select onchange="pvs[${i}].type=this.value">
                    <option value="STT"${item.type==="STT"?" selected":""}>STT</option>
                    <option value="RNV"${item.type==="RNV"?" selected":""}>RNV</option>
                    <option value="Fraude"${item.type==="Fraude"?" selected":""}>Fraude</option>
                    <option value="Titre tiers"${item.type==="Titre tiers"?" selected":""}>Titre tiers</option>
                    <option value="Date naissance"${item.type==="Date naissance"?" selected":""}>Date naissance</option>
                    <option value="Autre"${item.type==="Autre"?" selected":""}>Autre</option>
                </select>
                <label>Montant (€)</label>
                <input type="number" placeholder="Montant (€)" min="0" onchange="pvs[${i}].montant=this.value" value="${item.montant}">
                <button type="button" onclick="supprimerPV(${i})" class="del-btn">🗑️</button>
            </div>
        `;
    });
}

function incrementNbControles(val) {
    let inp = document.getElementById('nbControles');
    let current = parseInt(inp.value, 10) || 0;
    inp.value = current + val;
}

function onTrainInput() {
    clearTrainStatus();
    const trainNum = document.getElementById('train').value.trim();
    if (trainNum.length >= 3) {
        showTrainStats(trainNum);
    } else {
        const statsEl = document.getElementById('trainStats');
        if (statsEl) statsEl.style.display = 'none';
    }
}

function showTrainStats(trainNum) {
    const statsEl = document.getElementById('trainStats');
    if (!statsEl) return;
    
    const now = new Date();
    const day7Ago = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const day30Ago = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    let stats7 = { count: 0, personnes: 0, pvs: 0 };
    let stats30 = { count: 0, personnes: 0, pvs: 0 };
    
    controles.forEach(c => {
        if (c.train === trainNum && c.date) {
            const cDate = new Date(c.date);
            const personnes = parseInt(c.nbControles, 10) || 0;
            const pvs = (c.pvs || []).length;
            
            if (cDate >= day7Ago) {
                stats7.count++;
                stats7.personnes += personnes;
                stats7.pvs += pvs;
            }
            if (cDate >= day30Ago) {
                stats30.count++;
                stats30.personnes += personnes;
                stats30.pvs += pvs;
            }
        }
    });
    
    if (stats30.count > 0) {
        statsEl.style.display = 'block';
        document.getElementById('trainStatsNum').textContent = trainNum;
        
        const taux7 = stats7.personnes > 0 ? ((stats7.pvs / stats7.personnes) * 100).toFixed(1) : 0;
        const taux30 = stats30.personnes > 0 ? ((stats30.pvs / stats30.personnes) * 100).toFixed(1) : 0;
        
        document.getElementById('stats7days').innerHTML = `
            <div>Contrôles : ${stats7.count}</div>
            <div>Personnes : ${stats7.personnes}</div>
            <div>PVs : ${stats7.pvs}</div>
            <div>Taux fraude : <strong>${taux7}%</strong></div>
        `;
        
        document.getElementById('stats30days').innerHTML = `
            <div>Contrôles : ${stats30.count}</div>
            <div>Personnes : ${stats30.personnes}</div>
            <div>PVs : ${stats30.pvs}</div>
            <div>Taux fraude : <strong>${taux30}%</strong></div>
        `;
    } else {
        statsEl.style.display = 'none';
    }
}

document.getElementById("controleForm").onsubmit = function(e) {
    e.preventDefault();
    let photoInput = document.getElementById("photo");
    let photoFile = photoInput.files[0];
    let photoURL = photoFile ? URL.createObjectURL(photoFile) : "";

    // Ajouter les STT rapides aux listes
    for (let i = 0; i < sttControleCounter; i++) {
        billetsControles.push({type: 'STT', montant: 50});
    }
    for (let i = 0; i < sttPVCounter; i++) {
        pvs.push({type: 'STT', montant: 100});
    }

    const controle = {
        train: document.getElementById("train").value,
        origine: document.getElementById("origine").value,
        destination: document.getElementById("destination").value,
        heureDepart: document.getElementById("heureDepart").value,
        nbControles: document.getElementById("nbControles").value,
        riPositif: document.getElementById("riPositif").checked,
        riNegatif: document.getElementById("riNegatif").checked,
        commentaire: document.getElementById("commentaire").value,
        photo: photoURL,
        date: new Date().toISOString(),
        billetsExceptionnels: JSON.parse(JSON.stringify(billetsExceptionnels)),
        billetsControles: JSON.parse(JSON.stringify(billetsControles)),
        pvs: JSON.parse(JSON.stringify(pvs))
    };

    if (editingIndex !== null) {
        controle.photo = controles[editingIndex].photo;
        controle.date = controles[editingIndex].date || new Date().toISOString();
        controles[editingIndex] = controle;
    } else {
        controles.push(controle);
    }
    localStorage.setItem("controles", JSON.stringify(controles));
    billetsExceptionnels = [];
    billetsControles = [];
    pvs = [];
    sttControleCounter = 0;
    sttPVCounter = 0;
    document.getElementById('sttControleCount').textContent = '0';
    document.getElementById('sttPVCount').textContent = '0';
    afficherBilletsExceptionnels();
    afficherBilletsControles();
    afficherPvs();
    renderHistorique();
    this.reset();
    editingIndex = null;
    
    const statsEl = document.getElementById('trainStats');
    if (statsEl) statsEl.style.display = 'none';
};

function renderStats() {
    let totalControle = 0, totalBilletsControles = 0, totalPV = 0;
    controles.forEach(c => {
        totalControle += parseInt(c.nbControles,10)||0;
        totalBilletsControles += c.billetsControles.length;
        totalPV += c.pvs.length;
    });
    let taux = totalControle > 0 ? (100*(totalBilletsControles+totalPV)/totalControle) : 0;
    let statsDiv = document.getElementById("stats");
    statsDiv.innerHTML = `
        <strong>Personnes contrôlées :</strong> ${totalControle} &nbsp; |
        <strong>Tarifs contrôlés :</strong> ${totalBilletsControles} &nbsp; |
        <strong>PV :</strong> ${totalPV} &nbsp; |
        <strong>Taux fraude moyen :</strong> 
        <span class="${taux>=7?'taux-rouge':(taux>=5?'taux-orange':'taux-vert')}">${totalControle>0 ? taux.toFixed(1)+'%' : '—'}</span>
    `;
}

function sortTable(column) {
    if (currentSort.column === column) {
        currentSort.ascending = !currentSort.ascending;
    } else {
        currentSort.column = column;
        currentSort.ascending = true;
    }
    
    controles.sort((a, b) => {
        let valA, valB;
        
        switch(column) {
            case 'date':
                valA = a.date ? new Date(a.date) : new Date(0);
                valB = b.date ? new Date(b.date) : new Date(0);
                break;
            case 'train':
                valA = a.train || '';
                valB = b.train || '';
                break;
            case 'origine':
                valA = a.origine || '';
                valB = b.origine || '';
                break;
            case 'destination':
                valA = a.destination || '';
                valB = b.destination || '';
                break;
            case 'heureDepart':
                valA = a.heureDepart || '';
                valB = b.heureDepart || '';
                break;
            case 'nbControles':
                valA = parseInt(a.nbControles, 10) || 0;
                valB = parseInt(b.nbControles, 10) || 0;
                break;
            case 'totalOP':
                valA = (a.billetsExceptionnels?.length || 0) + (a.billetsControles?.length || 0) + (a.pvs?.length || 0);
                valB = (b.billetsExceptionnels?.length || 0) + (b.billetsControles?.length || 0) + (b.pvs?.length || 0);
                break;
            case 'taux':
                const persA = parseInt(a.nbControles, 10) || 0;
                const persB = parseInt(b.nbControles, 10) || 0;
                const fraudeA = (a.billetsControles?.length || 0) + (a.pvs?.length || 0);
                const fraudeB = (b.billetsControles?.length || 0) + (b.pvs?.length || 0);
                valA = persA > 0 ? (fraudeA / persA) : 0;
                valB = persB > 0 ? (fraudeB / persB) : 0;
                break;
            default:
                return 0;
        }
        
        if (valA < valB) return currentSort.ascending ? -1 : 1;
        if (valA > valB) return currentSort.ascending ? 1 : -1;
        return 0;
    });
    
    localStorage.setItem("controles", JSON.stringify(controles));
    renderHistorique();
}

function renderHistorique() {
    let tbody = document.querySelector("#historique tbody");
    tbody.innerHTML = "";
    controles.forEach((c, i) => {
        let totalPersonnes = parseInt(c.nbControles, 10) || 0;
        let totalFraude = (c.billetsControles.length + c.pvs.length);
        let taux = totalPersonnes > 0 ? (100 * totalFraude / totalPersonnes) : 0;
        let tauxTxt = totalPersonnes === 0 ? "—" : taux.toFixed(1) + "%";
        let tauxClass = (taux >= 7) ? "taux-rouge" : (taux >= 5 ? "taux-orange" : "taux-vert");

        let billetsTxt = resumeOps([...c.billetsExceptionnels, ...c.billetsControles]);
        let pvTxt = resumeOps(c.pvs);
        let totalOP = c.billetsExceptionnels.length + c.billetsControles.length + c.pvs.length;

        let dateFormatted = 'Non datée';
        if (c.date) {
            const d = new Date(c.date);
            dateFormatted = d.toLocaleDateString('fr-FR');
        }

        tbody.innerHTML += `
            <tr>
                <td>${dateFormatted}</td>
                <td>${c.train}</td>
                <td>${c.origine}</td>
                <td>${c.destination}</td>
                <td>${c.heureDepart}</td>
                <td>${c.nbControles}</td>
                <td>${billetsTxt}</td>
                <td>${pvTxt}</td>
                <td>${totalOP}</td>
                <td><span class="${tauxClass}">${tauxTxt}</span></td>
                <td>${c.riPositif ? "🟩" : ""}</td>
                <td>${c.riNegatif ? "🟥" : ""}</td>
                <td>${c.commentaire}</td>
                <td>${c.photo ? `<img src="${c.photo}" width="50"/>` : ''}</td>
                <td>
                    <button type="button" onclick="modifierSaisie(${i})" class="edit-btn">✏️</button>
                    <button type="button" onclick="supprimerSaisie(${i})" class="del-btn">🗑️</button>
                </td>
            </tr>
        `;
    });
    renderStats();
}

function supprimerSaisie(i) {
    if (confirm("Supprimer ?")) {
        controles.splice(i, 1);
        localStorage.setItem("controles", JSON.stringify(controles));
        renderHistorique();
    }
}

function modifierSaisie(i) {
    const c = controles[i];
    document.getElementById("train").value = c.train;
    document.getElementById("origine").value = c.origine;
    document.getElementById("destination").value = c.destination;
    document.getElementById("heureDepart").value = c.heureDepart;
    document.getElementById("nbControles").value = c.nbControles;
    document.getElementById("riPositif").checked = c.riPositif;
    document.getElementById("riNegatif").checked = c.riNegatif;
    document.getElementById("commentaire").value = c.commentaire;
    billetsExceptionnels = JSON.parse(JSON.stringify(c.billetsExceptionnels));
    billetsControles = JSON.parse(JSON.stringify(c.billetsControles));
    pvs = JSON.parse(JSON.stringify(c.pvs));
    afficherBilletsExceptionnels();
    afficherBilletsControles();
    afficherPvs();
    editingIndex = i;
    window.scrollTo({top:0, behavior:'smooth'});
}

afficherBilletsExceptionnels();
afficherBilletsControles();
afficherPvs();
renderHistorique();

function toggleParamsMenu() {
    document.getElementById('paramMenu').classList.toggle('active');
}

function clearTrainStatus() {
    const dot = document.getElementById('train-status-dot');
    const text = document.getElementById('train-status-text');
    if (dot) dot.style.background = '#ccc';
    if (text) text.textContent = '';
}

async function checkTrainStatus() {
    const trainNum = document.getElementById('train').value.trim();
    if (!trainNum) return;
    clearTrainStatus();
    const API_KEY = "YOUR_SNCF_API_KEY";
    const url = `https://api.sncf.com/v1/coverage/sncf/vehicle_journeys?external_code=${trainNum}`;
    try {
        const resp = await fetch(url, { headers: { Authorization: API_KEY } });
        if (!resp.ok) throw new Error();
        const data = await resp.json();
        const journey = data.vehicle_journeys?.[0];
        if (!journey) return;
        const status = journey.disruptions?.[0]?.status;
        const dep = journey.stop_times?.[0]?.departure_time;
        document.getElementById('heureDepart').value = dep ? dep.slice(0,5) : '';
        const dot = document.getElementById('train-status-dot');
        const text = document.getElementById('train-status-text');
        if (status === "delete") { dot.style.background="red"; text.textContent="SUPPRIMÉ"; }
        else if (status === "retard") { dot.style.background="orange"; text.textContent="+ retard"; }
        else { dot.style.background="green"; text.textContent="À l'heure"; }
    } catch {
        document.getElementById('train-status-dot').style.background="#999";
        document.getElementById('train-status-text').textContent="Erreur/Train inconnu";
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('tab-' + tabName).classList.add('active');
    event.target.classList.add('active');
}
