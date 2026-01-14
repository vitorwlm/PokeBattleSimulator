// --- LÓGICA DE BATALHA ---

async function handleAttack(move) {
    // 1. Turno do Jogador
    toggleButtons(false); // Bloqueia cliques
    
    const damage = calculateDamage(player, enemy);
    enemy.currentHp -= damage;
    if (enemy.currentHp < 0) enemy.currentHp = 0;

    updateHealthUI('enemy', enemy);
    log(`${player.name} usou ${move.name} e causou ${damage} dano!`);

    // Verificar Vitória
    if (enemy.currentHp === 0) {
        log("🏆 Venceste a batalha!");
        // A função de salvar o vencedor foi removida aqui
        return;
    }

    // 2. Turno do Inimigo (após 1.5s)
    setTimeout(() => {
        const enemyDamage = calculateDamage(enemy, player);
        player.currentHp -= enemyDamage;
        if (player.currentHp < 0) player.currentHp = 0;

        updateHealthUI('player', player);
        log(`O Inimigo atacou e causou ${enemyDamage} dano!`);

        if (player.currentHp === 0) {
            log("💀 Perdeste... Tenta novamente (F5).");
        } else {
            toggleButtons(true); // Devolve o turno ao jogador
        }
    }, 1500);
}

// Fórmula de Dano Simplificada
function calculateDamage(attacker, defender) {
    // Dano = (Ataque / Defesa) * Fator Aleatório
    const baseDamage = (attacker.attack / defender.defense) * 20;
    const random = (Math.random() * 0.4) + 0.8; // Variação entre 0.8 e 1.2
    return Math.floor(baseDamage * random);
}

// --- UI HELPERS ---

function updateHealthUI(type, pokemon) {
    const percent = (pokemon.currentHp / pokemon.maxHp) * 100;
    document.getElementById(`${type}-hp-bar`).style.width = `${percent}%`;
    document.getElementById(`${type}-hp-text`).innerText = `${pokemon.currentHp}/${pokemon.maxHp}`;
    
    // Mudar cor se vida baixa
    if(percent < 20) {
        document.getElementById(`${type}-hp-bar`).style.backgroundColor = 'red';
    }
}

function log(message) {
    document.getElementById('battle-log').innerText = message;
}

function toggleButtons(enable) {
    const btns = document.querySelectorAll('.move-btn');
    btns.forEach(btn => btn.disabled = !enable);
}