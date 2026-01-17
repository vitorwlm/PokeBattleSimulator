// --- RANKING (MOCK API) ---

async function saveWinner() {
    const name = prompt("Ganhaste! Digita o teu nome para o Ranking:");
    if (!name) return;

    const body = {
        name: name,
        pokemon: player.name,
        date: new Date().toLocaleDateString()
    };

    await fetch("https://69652f8ee8ce952ce1f47235.mockapi.io/winner", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    alert("Guardado no Ranking!");
    loadRanking(); // Atualiza a lista
}

async function loadRanking() {
    try {
        const res = await fetch("https://69652f8ee8ce952ce1f47235.mockapi.io/winner");
        const data = await res.json();

        const list = document.getElementById('ranking-list');
        list.innerHTML = '';

        // Mostrar os últimos 5 vencedores (invertendo o array)
        data.slice(-5).reverse().forEach(winner => {
            const li = document.createElement('li');
            li.innerText = `${winner.date} - ${winner.name} (com ${winner.pokemon})`;
            list.appendChild(li);
        });
    } catch (e) {
        console.log("Erro ao carregar ranking (Verifica o URL da API)");
    }
}