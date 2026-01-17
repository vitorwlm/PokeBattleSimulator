// Lógica de atacar: turno do jogador seguido de turno do inimigo (com delay)
async function handleAttack(move) {
    toggleButtons(false);
    
    // Jogador ataca
    const damage = calculateDamage(player, enemy);
    enemy.currentHp -= damage;
    if (enemy.currentHp < 0) enemy.currentHp = 0;

    updateHealthUI('enemy', enemy);
    log(`${player.name} usou ${move.name} e causou ${damage} dano!`);


    
    // Verificar vitória
    if (enemy.currentHp === 0) {
        log("🏆 Venceste a batalha!");
        saveWinner();
        return;
    }

    // Inimigo ataca após 1.5 segundos
    setTimeout(() => {
        const enemyDamage = calculateDamage(enemy, player);
        player.currentHp -= enemyDamage;
        if (player.currentHp < 0) player.currentHp = 0;

        updateHealthUI('player', player);
        log(`O Inimigo atacou e causou ${enemyDamage} dano!`);

        // Verificar derrota ou continuar
        if (player.currentHp === 0) {
            log("💀 Perdeste... Tenta novamente (F5).");
        } else {
            toggleButtons(true);
        }
    }, 1500);
}

// Calcular dano baseado em ataque/defesa com variação aleatória
function calculateDamage(attacker, defender) {
    const baseDamage = (attacker.attack / defender.defense) * 20;
    const random = (Math.random() * 0.4) + 0.8;
    return Math.floor(baseDamage * random);
}

// Atualizar barra de HP na interface
function updateHealthUI(type, pokemon) {
    const percent = (pokemon.currentHp / pokemon.maxHp) * 100;
    document.getElementById(`${type}-hp-bar`).style.width = `${percent}%`;
    document.getElementById(`${type}-hp-text`).innerText = `${pokemon.currentHp}/${pokemon.maxHp}`;
    
    // HP baixo = barra vermelha
    if(percent < 20) {
        document.getElementById(`${type}-hp-bar`).style.backgroundColor = 'red';
    }
}

// Mostrar mensagem no log de batalha
function log(message) {
    document.getElementById('battle-log').innerText = message;
}

// Ativar/desativar botões de ataque durante o turno do inimigo
function toggleButtons(enable) {
    const btns = document.querySelectorAll('.move-btn');
    btns.forEach(btn => btn.disabled = !enable);
}