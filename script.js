async function loadCSV(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.text();
        const rows = data.split('\n').slice(1).filter(row => {
            const columns = row.split(',');
            return columns.length === 3 && columns.every(col => col.trim() !== '');
        });
        return rows.map(row => {
            const [cidade, posto, telefone] = row.split(',').map(item => item.trim());
            return { cidade, posto, telefone };
        });
    } catch (error) {
        console.error('Error loading CSV:', error);
        return [];
    }
}

function filterResults(data, query) {
    return data.filter(item => 
        item.cidade.toLowerCase().includes(query) ||
        item.posto.toLowerCase().includes(query)
    );
}

function updateTable(data) {
    const tableBody = document.querySelector('#resultTable tbody');
    const resultTable = document.getElementById('resultTable');
    tableBody.innerHTML = ''; // Limpa a tabela atual

    if (data.length === 0) {
        resultTable.style.display = 'none'; // Oculta a tabela se não houver resultados
        return;
    }

    data.forEach(item => {
        if (item) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.cidade || 'N/A'}</td>
                <td>${item.posto || 'N/A'}</td>
                <td>${item.telefone || 'N/A'}</td>
            `;
            tableBody.appendChild(row);
        }
    });

    resultTable.style.display = 'table'; // Mostra a tabela quando houver resultados
}

async function main() {
    const csvData = await loadCSV('cidades.csv');

    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredData = filterResults(csvData, query);
        updateTable(filteredData);
    });
}

main();
