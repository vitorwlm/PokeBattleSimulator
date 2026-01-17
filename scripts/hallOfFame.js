// [CTeSP] Sistema de Ranking
// Exemplo de operações CRUD (Read e Update) na API.

// --- RANKING (MOCK API) ---

async function updateScore(pointsToAdd) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    // Verificação de segurança: se não houver user ou ID, não podemos gravar o ranking corretamente
    if (!currentUser || !currentUser.id) {
        console.error("Erro: Utilizador não autenticado ou ID em falta.");
        return;
    }

    // Calcular novo score
    let newScore = (Number(currentUser.score) || 0) + pointsToAdd;
    
    if (newScore < 0) newScore = 0; // Evitar pontuação negativa

    try {
        // Atualizar o score na tabela de Players (Fonte única, evita duplicados)
        await fetch(`${MOCK_API_URL}/${currentUser.id}`, { 
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...currentUser, score: newScore })
        });

        // Atualizar a sessão local para refletir o novo score
        currentUser.score = newScore;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        if (typeof log === "function") {
            const msg = pointsToAdd > 0 
                ? `🏅 Vitória! (+${pointsToAdd} pontos)` 
                : `💀 Derrota... (${pointsToAdd} pontos)`;
            log(msg);
        }
        loadRanking();
    } catch (error) {
        console.error("Erro ao atualizar score:", error);
    }
}

async function loadRanking() {
    try {
        // Ler diretamente da lista de Players para garantir utilizadores únicos
        const res = await fetch(MOCK_API_URL);
        const data = await res.json();

        const list = document.getElementById('ranking-list');
        if (!list) {
            console.warn("Elemento 'ranking-list' não encontrado no HTML.");
            return;
        }

        list.innerHTML = '';

        // Ordenação de Arrays: .sort()
        // Ordena por score (decrescente) e pega os top 10 (.slice)
        data.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))
            .slice(0, 10)
            .forEach((entry, index) => {
                const li = document.createElement('li');
                const rank = index + 1;
                
                let medal = `<span class="rank-num">#${rank}</span>`;
                let specialClass = '';

                if (rank === 1) { medal = '👑'; specialClass = 'rank-gold'; }
                else if (rank === 2) { medal = '🥈'; specialClass = 'rank-silver'; }
                else if (rank === 3) { medal = '🥉'; specialClass = 'rank-bronze'; }

                li.className = `ranking-item ${specialClass}`;
                li.innerHTML = `
                    <div class="rank-left">${medal} <span class="rank-name">${entry.username}</span></div>
                    <div class="rank-score">${entry.score} <small>pts</small></div>
                `;
                list.appendChild(li);
            });
    } catch (e) {
        console.log("Erro ao carregar ranking");
    }
}

// Carregar o ranking assim que a página do jogo abrir
document.addEventListener('DOMContentLoaded', loadRanking);