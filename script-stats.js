function initStatisticsPageModified() {
    const controles = JSON.parse(localStorage.getItem('controles')) || [];
    
    calculateOverviewStats(controles);
    generateChartParTrain(controles);
    generateChartParJour(controles);
    fillTableParTrain(controles);
}

function calculateOverviewStats(controles) {
    let totalControles = controles.length;
    let totalPersonnes = 0;
    let totalBilletsControles = 0;
    let totalPVs = 0;
    
    controles.forEach(c => {
        totalPersonnes += parseInt(c.nbControles, 10) || 0;
        totalBilletsControles += (c.billetsControles || []).length;
        totalPVs += (c.pvs || []).length;
    });
    
    let tauxFraude = totalPersonnes > 0 ? ((totalPVs / totalPersonnes) * 100).toFixed(1) : 0;
    
    document.getElementById('totalControles').textContent = totalControles;
    document.getElementById('totalPersonnes').textContent = totalPersonnes;
    document.getElementById('totalBilletsControles').textContent = totalBilletsControles;
    document.getElementById('totalPVs').textContent = totalPVs;
    document.getElementById('tauxFraude').textContent = tauxFraude + '%';
}

function generateChartParTrain(controles) {
    const trainStats = {};
    
    controles.forEach(c => {
        const train = c.train || 'Inconnu';
        if (!trainStats[train]) {
            trainStats[train] = { nbControles: 0, personnes: 0, billets: 0, pvs: 0 };
        }
        trainStats[train].nbControles += 1;
        trainStats[train].personnes += parseInt(c.nbControles, 10) || 0;
        trainStats[train].billets += (c.billetsControles || []).length;
        trainStats[train].pvs += (c.pvs || []).length;
    });
    
    const sortedTrains = Object.entries(trainStats).sort((a, b) => b[1].nbControles - a[1].nbControles);
    const top10Trains = sortedTrains.slice(0, 10);
    
    const labels = top10Trains.map(([train, _]) => train);
    const dataPersonnes = top10Trains.map(([_, stats]) => stats.personnes);
    const dataPVs = top10Trains.map(([_, stats]) => stats.pvs);
    
    const ctx = document.getElementById('chartParTrain').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Personnes Contrôlées',
                    data: dataPersonnes,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'PVs Émis',
                    data: dataPVs,
                    backgroundColor: 'rgba(255, 99, 132, 0.7)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: { y: { beginAtZero: true } },
            plugins: {
                legend: { display: true, position: 'top' },
                title: { display: true, text: 'Top 10 des trains les plus contrôlés' }
            }
        }
    });
}

function generateChartParJour(controles) {
    const dateStats = {};
    
    controles.forEach(c => {
        const date = c.date ? new Date(c.date).toLocaleDateString('fr-FR') : 'Date inconnue';
        if (!dateStats[date]) {
            dateStats[date] = { nbControles: 0, personnes: 0, pvs: 0 };
        }
        dateStats[date].nbControles += 1;
        dateStats[date].personnes += parseInt(c.nbControles, 10) || 0;
        dateStats[date].pvs += (c.pvs || []).length;
    });
    
    const sortedDates = Object.entries(dateStats).sort((a, b) => {
        if (a[0] === 'Date inconnue') return 1;
        if (b[0] === 'Date inconnue') return -1;
        const [dayA, monthA, yearA] = a[0].split('/');
        const [dayB, monthB, yearB] = b[0].split('/');
        return new Date(yearA, monthA - 1, dayA) - new Date(yearB, monthB - 1, dayB);
    });
    
    const labels = sortedDates.map(([date, _]) => date);
    const dataPersonnes = sortedDates.map(([_, stats]) => stats.personnes);
    const dataPVs = sortedDates.map(([_, stats]) => stats.pvs);
    
    const ctx = document.getElementById('chartParJour').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Personnes Contrôlées',
                    data: dataPersonnes,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: 'PVs Émis',
                    data: dataPVs,
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: { y: { beginAtZero: true } },
            plugins: {
                legend: { display: true, position: 'top' },
                title: { display: true, text: 'Évolution des contrôles par jour' }
            }
        }
    });
}

function fillTableParTrain(controles) {
    const trainStats = {};
    
    controles.forEach(c => {
        const train = c.train || 'Inconnu';
        if (!trainStats[train]) {
            trainStats[train] = { nbControles: 0, personnes: 0, billets: 0, pvs: 0 };
        }
        trainStats[train].nbControles += 1;
        trainStats[train].personnes += parseInt(c.nbControles, 10) || 0;
        trainStats[train].billets += (c.billetsControles || []).length;
        trainStats[train].pvs += (c.pvs || []).length;
    });
    
    const sortedTrains = Object.entries(trainStats).sort((a, b) => b[1].nbControles - a[1].nbControles);
    
    const tbody = document.getElementById('tableParTrainBody');
    tbody.innerHTML = '';
    
    sortedTrains.forEach(([train, stats]) => {
        const tauxFraude = stats.personnes > 0 ? ((stats.pvs / stats.personnes) * 100).toFixed(1) : 0;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${train}</strong></td>
            <td>${stats.nbControles}</td>
            <td>${stats.personnes}</td>
            <td>${stats.billets}</td>
            <td>${stats.pvs}</td>
            <td>${tauxFraude}%</td>
        `;
        tbody.appendChild(row);
    });
}
