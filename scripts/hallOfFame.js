/**
 * [SISTEMA DE PONTUAÇÃO]
 * Gere a atualização de pontos e a visualização do ranking.
 */

// Atualiza a pontuação do jogador após uma batalha.
// Recebe pontos positivos (vitória) ou negativos (derrota/desistência).
async function updateScore(pointsToAdd) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!currentUser || !currentUser.id) {
        console.error("Erro: Utilizador não autenticado ou ID em falta.");
        return;
    }

    try {
        // 1. GET: Buscar o registo específico deste jogador na tabela HallOfFame
        // Usamos query string '?playerId=...' para filtrar diretamente na API
        const res = await fetch(`${MOCK_API_URL_HALL}?playerId=${currentUser.id}`);
        const data = await res.json();

        if (data.length > 0) {
            const hallEntry = data[0];
            
            // Calcular novo score garantindo que não fica negativo
            let newScore = (Number(hallEntry.score) || 0) + pointsToAdd;
            if (newScore < 0) newScore = 0;

            // Lógica de Persistência da Equipa:
            // Só atualizamos a equipa guardada se o jogador GANHAR (pointsToAdd > 0).
            let teamToSave = hallEntry.pokemons;
            if (pointsToAdd > 0) {
                const storedTeam = localStorage.getItem('selectedTeam');
                if (storedTeam) {
                    teamToSave = JSON.parse(storedTeam);
                }
            }

            // Construímos um objeto limpo para o PUT.
            // MOTIVO: Evitar enviar campos "lixo" ou duplicados que a API possa ter gerado.
            const updatedEntry = {
                username: hallEntry.username,
                score: newScore,
                playerId: hallEntry.playerId,
                pokemons: teamToSave
            };

            // 2. PUT: Atualizar o registo na base de dados
            await fetch(`${MOCK_API_URL_HALL}/${hallEntry.id}`, { 
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedEntry)
            });

            // Feedback visual no log de batalha (se a função log existir)
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

// Carrega e desenha a lista de melhores jogadores
async function loadRanking() {
    try {
        // GET: Buscar todos os registos
        const res = await fetch(MOCK_API_URL_HALL);
        const data = await res.json();

        const list = document.getElementById('ranking-list');
        if (!list) {
            console.warn("Elemento 'ranking-list' não encontrado no HTML.");
            return;
        }

        list.innerHTML = '';

        // ORDENAÇÃO (SORT):
        // Ordenamos o array de forma decrescente (b - a) baseada no score.
        // Usamos .slice(0, 10) para mostrar apenas o TOP 10 (Performance e UI limpa).
        data.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0))
            .slice(0, 10)
            .forEach((entry, index) => {
                const li = document.createElement('li');
                const rank = index + 1;
                
                // Atribuição de medalhas para o pódio
                let medal = `<span class="rank-num">#${rank}</span>`;
                let specialClass = '';

                if (rank === 1) { medal = '👑'; specialClass = 'rank-gold'; }
                else if (rank === 2) { medal = '🥈'; specialClass = 'rank-silver'; }
                else if (rank === 3) { medal = '🥉'; specialClass = 'rank-bronze'; }

                // Renderização das imagens da equipa (se existirem)
                let teamHtml = '';
                if (Array.isArray(entry.pokemons)) {
                    teamHtml = '<div class="rank-team">';
                    entry.pokemons.forEach(id => {
                        teamHtml += `<img src="${SPRITE_BASE_URL}${id}.png" alt="Pkmn">`;
                    });
                    teamHtml += '</div>';
                }

                // Template String para criar o HTML do cartão
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

// Carrega o ranking assim que o DOM estiver pronto
document.addEventListener('DOMContentLoaded', loadRanking);