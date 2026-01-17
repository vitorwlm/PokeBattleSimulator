// --- RANKING (MOCK API) ---

async function saveWinner() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Verificação de segurança: se não houver user ou ID, não podemos gravar o ranking corretamente
    if (!currentUser || !currentUser.id) {
        console.error("Erro: Utilizador não autenticado ou ID em falta.");
        return;
    }

    // Incrementamos o score (ex: +1 ponto por vitória)
    const newScore = (Number(currentUser.score) || 0) + 1;

    const body = {
        PlayerId: currentUser.id, // Garante que o ID do jogador é enviado
        username: currentUser.username,
        score: newScore
    };

    try {
        // 1. Gravar a entrada no Hall of Fame
        await fetch(MOCK_API_URL_HALL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });

        // 2. Atualizar o score total do jogador na tabela de Players
        await fetch(`${MOCK_API_URL}/${currentUser.id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...currentUser, score: newScore })
        });

        // 3. Atualizar a sessão local para refletir o novo score
        currentUser.score = newScore;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        if (typeof log === "function") log("🏅 Vitória registada no Hall of Fame!");
        loadRanking();
    } catch (error) {
        console.error("Erro ao salvar no ranking:", error);
    }
}

async function loadRanking() {
    try {
        const res = await fetch(MOCK_API_URL_HALL);
        const data = await res.json();

        const list = document.getElementById('ranking-list');
        if (!list) return;

        list.innerHTML = '';

        // Ordenar por score (maior para menor) e mostrar os 5 melhores
        data.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))
            .slice(0, 5)
            .forEach(entry => {
                const li = document.createElement('li');
                // Se o username for nulo por algum motivo, mostra "Anónimo"
                li.innerText = `${entry.username} - Pontuação: ${entry.score}`;
                list.appendChild(li);
            });
    } catch (e) {
        console.log("Erro ao carregar ranking");
    }
}