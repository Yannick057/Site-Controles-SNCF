function deleteAllData() {
    if (confirm("⚠️ ATTENTION !\n\nVoulez-vous vraiment supprimer TOUTES les données ?\nCette action est irréversible !")) {
        if (confirm("Êtes-vous absolument certain ? Toutes vos données seront perdues !")) {
            localStorage.removeItem('controles');
            controles = [];
            renderHistorique();
            alert("✅ Toutes les données ont été supprimées.");
            toggleParamsMenu();
        }
    }
}

function exportJsonControls() {
    const controles = JSON.parse(localStorage.getItem('controles')) || [];
    if (controles.length === 0) {
        alert("Aucune donnée à exporter !");
        return;
    }
    
    const dataStr = JSON.stringify(controles, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `controles-sncf-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    alert(`${controles.length} contrôle(s) exporté(s) avec succès !`);
}

function importJsonControls() {
    const fileInput = document.getElementById('importJsonFile');
    if (!fileInput.files.length) return alert("Sélectionne d'abord un fichier export JSON !");
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);
            const arr = Array.isArray(data) ? data : Object.values(data);
            const toMontant = arr => arr ? arr.map(b => ({
                type: b.type,
                montant: b.montant ?? b.amount ?? ""
            })) : [];
            
            const mapped = arr.map(c => {
                let dateToUse = c.timestamp || c.date || new Date().toISOString();
                
                return {
                    train: c.trainNumber || c.train || "",
                    origine: c.origin || c.origine || "",
                    destination: c.destination || "",
                    heureDepart: c.departureTime || c.heureDepart || "",
                    nbControles: c.controlledPeople || c.nbControles || "",
                    billetsExceptionnels: toMontant(c.tickets || c.billetsExceptionnels),
                    billetsControles: toMontant(c.controles || c.billetsControles),
                    pvs: toMontant(c.pvs),
                    riPositif: c.riPositif || false,
                    riNegatif: c.riNegatif || false,
                    commentaire: c.comment || c.commentaire || "",
                    photo: c.photoPath || c.photo || "",
                    date: dateToUse
                };
            });
            
            controles = [...controles, ...mapped];
            localStorage.setItem('controles', JSON.stringify(controles));
            renderHistorique();
            alert(`Import terminé ! ${mapped.length} contrôle(s) importé(s) avec dates.`);
            toggleParamsMenu();
        } catch (err) { 
            alert("Erreur d'import: " + err.message); 
        }
    };
    reader.readAsText(fileInput.files[0]);
}

function exportHTML() {
    let controles = JSON.parse(localStorage.getItem('controles')) || [];
    const exportType = document.getElementById('exportType')?.value || 'date';
    
    let sortedControles = [...controles];
    if (exportType === 'date') {
        sortedControles.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } else if (exportType === 'train') {
        sortedControles.sort((a, b) => (a.train || '').localeCompare(b.train || ''));
    } else if (exportType === 'origine') {
        sortedControles.sort((a, b) => (a.origine || '').localeCompare(b.origine || ''));
    }
    
    let html = `
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Export Contrôles SNCF</title>
        <style>
            body{font-family:arial;background:#f6f6f9;margin:18px;}
            h2{color:#bb003b;}
            table{width:100%;border-collapse:collapse;background:#fff;border-radius:14px;box-shadow:0 2px 11px #e2e5ec;}
            th,td{padding:7px;text-align:center;border-bottom:1px solid #eee;}
            th{background:#edf1f9;color:#bb003b;}
            tr:last-child td{border-bottom:none;}
            .taux-vert{background:#e6fae6;color:#2c880a;font-weight:bold;border-radius:5px;padding:2px 7px;}
            .taux-orange{background:#fff4db;color:#ee9707;font-weight:bold;border-radius:5px;padding:2px 7px;}
            .taux-rouge{background:#fadada;color:#bb003b;font-weight:bold;border-radius:5px;padding:2px 7px;}
        </style>
    </head>
    <body>
        <h2>Bilan Contrôles SNCF exporté (Tri: ${exportType})</h2>
        <p><strong>Date export :</strong> ${new Date().toLocaleString()}</p>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Train</th>
                    <th>Origine</th>
                    <th>Destination</th>
                    <th>Heure</th>
                    <th>Personnes</th>
                    <th>Op. Tarifs</th>
                    <th>Op. PV</th>
                    <th>OP total</th>
                    <th>Taux fraude</th>
                    <th>Commentaire</th>
                </tr>
            </thead>
            <tbody>
    `;
    sortedControles.forEach(c => {
        let billetsTxt = resumeOps([...(c.billetsExceptionnels||[]), ...(c.billetsControles||[])]);
        let pvTxt = resumeOps(c.pvs||[]);
        let totalOP = (c.billetsExceptionnels||[]).length + (c.billetsControles||[]).length + (c.pvs||[]).length;
        let totalPersonnes = parseInt(c.nbControles, 10) || 0;
        let totalFraude = (c.billetsControles||[]).length + (c.pvs||[]).length;
        let taux = totalPersonnes > 0 ? (100 * totalFraude / totalPersonnes) : 0;
        let tauxTxt = totalPersonnes === 0 ? "—" : taux.toFixed(1) + "%";
        let tauxClass = "taux-vert";
        if (taux >= 7) tauxClass = "taux-rouge";
        else if (taux >= 5) tauxClass = "taux-orange";
        
        let dateFormatted = 'Non datée';
        if (c.date) {
            const d = new Date(c.date);
            dateFormatted = d.toLocaleDateString('fr-FR');
        }
        
        html += `
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
                <td>${c.commentaire}</td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
        <p><em>Bilan exporté depuis l'app SNCF Contrôles le ${new Date().toLocaleString()}.</em></p>
    </body>
    </html>`;
    const blob = new Blob([html], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'BilanControleSncf.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function exportPDF() {
    let controles = JSON.parse(localStorage.getItem('controles')) || [];
    const exportType = document.getElementById('exportType')?.value || 'date';
    
    let sortedControles = [...controles];
    if (exportType === 'date') {
        sortedControles.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    } else if (exportType === 'train') {
        sortedControles.sort((a, b) => (a.train || '').localeCompare(b.train || ''));
    } else if (exportType === 'origine') {
        sortedControles.sort((a, b) => (a.origine || '').localeCompare(b.origine || ''));
    }
    
    let win = window.open("", "_blank");
    let html = `
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Export Contrôles SNCF (PDF)</title>
        <style>
            body{font-family:arial;background:#f6f6f9;margin:18px;}
            h2{color:#bb003b;}
            table{width:100%;border-collapse:collapse;background:#fff;border-radius:14px;box-shadow:0 2px 11px #e2e5ec;}
            th,td{padding:7px;text-align:center;border-bottom:1px solid #eee;}
            th{background:#edf1f9;color:#bb003b;}
            tr:last-child td{border-bottom:none;}
            .taux-vert{background:#e6fae6;color:#2c880a;font-weight:bold;border-radius:5px;padding:2px 7px;}
            .taux-orange{background:#fff4db;color:#ee9707;font-weight:bold;border-radius:5px;padding:2px 7px;}
            .taux-rouge{background:#fadada;color:#bb003b;font-weight:bold;border-radius:5px;padding:2px 7px;}
        </style>
    </head>
    <body>
        <h2>Bilan Contrôles SNCF exporté (PDF - Tri: ${exportType})</h2>
        <p><strong>Date export :</strong> ${new Date().toLocaleString()}</p>
        <table>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Train</th>
                    <th>Origine</th>
                    <th>Destination</th>
                    <th>Heure</th>
                    <th>Personnes</th>
                    <th>Op. Tarifs</th>
                    <th>Op. PV</th>
                    <th>OP total</th>
                    <th>Taux fraude</th>
                    <th>Commentaire</th>
                </tr>
            </thead>
            <tbody>
    `;
    sortedControles.forEach(c => {
        let billetsTxt = resumeOps([...(c.billetsExceptionnels||[]), ...(c.billetsControles||[])]);
        let pvTxt = resumeOps(c.pvs||[]);
        let totalOP = (c.billetsExceptionnels||[]).length + (c.billetsControles||[]).length + (c.pvs||[]).length;
        let totalPersonnes = parseInt(c.nbControles, 10) || 0;
        let totalFraude = (c.billetsControles||[]).length + (c.pvs||[]).length;
        let taux = totalPersonnes > 0 ? (100 * totalFraude / totalPersonnes) : 0;
        let tauxTxt = totalPersonnes === 0 ? "—" : taux.toFixed(1) + "%";
        let tauxClass = "taux-vert";
        if (taux >= 7) tauxClass = "taux-rouge";
        else if (taux >= 5) tauxClass = "taux-orange";
        
        let dateFormatted = 'Non datée';
        if (c.date) {
            const d = new Date(c.date);
            dateFormatted = d.toLocaleDateString('fr-FR');
        }
        
        html += `
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
                <td>${c.commentaire}</td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
        <p><em>Bilan exporté depuis l'app SNCF Contrôles le ${new Date().toLocaleString()}.</em></p>
        <script>
            window.onload = function() { window.print(); }
        </script>
    </body>
    </html>`;
    win.document.write(html);
    win.document.close();
}
