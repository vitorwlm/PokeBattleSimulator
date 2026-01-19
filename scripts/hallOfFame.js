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

    try {
        // 1. Buscar o registo no Hall of Fame pelo playerId
        const res = await fetch(`${MOCK_API_URL_HALL}?playerId=${currentUser.id}`);
        const data = await res.json();

        if (data.length > 0) {
            const hallEntry = data[0];
            
            // Calcular novo score usando o valor da base de dados
            let newScore = (Number(hallEntry.score) || 0) + pointsToAdd;
            if (newScore < 0) newScore = 0;

            // Atualizar a equipa guardada apenas em caso de vitória (> 0 pontos)
            let teamToSave = hallEntry.pokemons;
            if (pointsToAdd > 0) {
                const storedTeam = localStorage.getItem('selectedTeam');
                if (storedTeam) {
                    teamToSave = JSON.parse(storedTeam);
                }
            }

            // Construir objeto limpo para evitar enviar campos duplicados/nulos (ex: PlayerId vs playerId)
            const updatedEntry = {
                username: hallEntry.username,
                score: newScore,
                playerId: hallEntry.playerId, // Manter a chave correta (camelCase)
                pokemons: teamToSave
            };

            // 2. Atualizar o registo no Hall of Fame
            await fetch(`${MOCK_API_URL_HALL}/${hallEntry.id}`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedEntry)
            });

            if (typeof log === "function") {
                const msg = pointsToAdd > 0 
                    ? `🏅 Vitória! (+${pointsToAdd} pontos)` 
                    : `💀 Derrota... (${pointsToAdd} pontos)`;
                log(msg);
            }
            loadRanking();
        }
    } catch (error) {
        console.error("Erro ao atualizar score:", error);
    }
}

async function loadRanking() {
    try {
        // Ler da tabela HallOfFame
        const res = await fetch(MOCK_API_URL_HALL);
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

                // Gerar HTML das imagens dos pokémons (se existirem)
                let teamHtml = '';
                if (Array.isArray(entry.pokemons)) {
                    teamHtml = '<div class="rank-team">';
                    entry.pokemons.forEach(id => {
                        teamHtml += `<img src="${SPRITE_BASE_URL}${id}.png" alt="Pkmn">`;
                    });
                    teamHtml += '</div>';
                }

                li.className = `ranking-item ${specialClass}`;
                li.innerHTML = `
                    <div class="rank-left">${medal} <span class="rank-name">${entry.username}</span> ${teamHtml}</div>
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