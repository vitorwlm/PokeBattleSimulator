// [CTeSP] Lógica de Batalha
// Controla os turnos, cálculo de dano e condições de vitória/derrota.

// Variáveis de Estado da Equipa
let playerTeam = [];
let enemyTeam = [];
let player = {}; // Pokémon atual do jogador
let enemy = {};  // Pokémon atual do inimigo
let playerIndex = 0;
let enemyIndex = 0;

// Função chamada pelo setup.js para iniciar a lógica
function startBattleLogic(pTeam, eTeam) {
    playerTeam = pTeam;
    enemyTeam = eTeam;
    playerIndex = 0;
    enemyIndex = 0;

    // Definir os pokémons ativos globais (para compatibilidade com funções existentes)
    player = playerTeam[playerIndex];
    enemy = enemyTeam[enemyIndex];
    
    updateTeamIndicators();
    renderGame();
}

// Renderizar interface de batalha: mostrar Pokémon, HP e botões de ataque
function renderGame() {
    document.getElementById("player-name").innerText = player.name;
    document.getElementById("player-img").src = player.sprite;
    updateHealthUI("player", player);

    document.getElementById("enemy-name").innerText = enemy.name;
    document.getElementById("enemy-img").src = enemy.sprite;
    updateHealthUI("enemy", enemy);

    // Mostrar o menu de batalha
    renderBattleMenu();
}

// --- SISTEMA DE MENUS DE BATALHA ---

// Menu Principal (Batalhar, Trocar, Desistir)
function renderBattleMenu() {
    const container = document.getElementById('moves-container');
    if (!container) return;
    container.innerHTML = '';

    // Botão Batalhar
    const btnFight = document.createElement('button');
    btnFight.innerText = "⚔️ Batalhar";
    btnFight.className = "move-btn";
    btnFight.onclick = () => showMoves();
    container.appendChild(btnFight);

    // Botão Trocar
    const btnSwitch = document.createElement('button');
    btnSwitch.innerText = "🔄 Trocar Pokémon";
    btnSwitch.className = "move-btn";
    btnSwitch.onclick = () => showSwitchMenu();
    container.appendChild(btnSwitch);

    // Botão Desistir
    const btnRun = document.createElement('button');
    btnRun.innerText = "🏳️ Desistir";
    btnRun.className = "move-btn";
    btnRun.style.backgroundColor = "#ef4444"; // Vermelho
    btnRun.style.color = "white";
    btnRun.onclick = () => handleForfeit();
    container.appendChild(btnRun);
}

// Sub-menu: Mostrar Ataques
function showMoves() {
    const container = document.getElementById('moves-container');
    container.innerHTML = '';

    player.moves.forEach((move) => {
        const btn = document.createElement("button");
        btn.innerText = move.name;
        btn.onclick = () => handleAttack(move);
        btn.className = "move-btn";
        container.appendChild(btn);
    });

    // Botão Voltar
    addBackButton(container);
}

// Sub-menu: Mostrar Equipa para Troca
function showSwitchMenu() {
    const container = document.getElementById('moves-container');
    container.innerHTML = '';

    playerTeam.forEach((p, index) => {
        const btn = document.createElement('button');
        btn.innerText = `${p.name} (${p.currentHp}/${p.maxHp})`;
        btn.className = "move-btn";
        
        // Desativar se for o atual ou estiver desmaiado
        if (index === playerIndex || p.currentHp <= 0) {
            btn.disabled = true;
            btn.style.opacity = "0.5";
        } else {
            btn.onclick = () => performSwitch(index);
        }
        container.appendChild(btn);
    });

    addBackButton(container);
}

function addBackButton(container) {
    const btnBack = document.createElement('button');
    btnBack.innerText = "⬅️ Voltar";
    btnBack.className = "move-btn";
    btnBack.style.backgroundColor = "#9ca3af"; // Cinzento
    btnBack.onclick = () => renderBattleMenu();
    container.appendChild(btnBack);
}

// Lógica de atacar: turno do jogador seguido de turno do inimigo (com delay)
async function handleAttack(move) {
    toggleButtons(false);
    
    // Jogador ataca
    const damage = calculateDamage(player, enemy);
    enemy.currentHp -= damage;
    animateDamage('enemy'); // Animar o inimigo a receber dano
    if (enemy.currentHp < 0) enemy.currentHp = 0;

    updateHealthUI('enemy', enemy);
    log(`${player.name} usou ${move.name} e causou ${damage} dano!`);

    // Verificar vitória
    if (enemy.currentHp === 0) {
        log(`${enemy.name} desmaiou!`);
        
        // Verificar se o inimigo tem mais pokémons
        if (enemyIndex < enemyTeam.length - 1) {
            setTimeout(() => {
                switchEnemyPokemon();
                toggleButtons(true);
            }, 1500);
        } else {
            // Vitória Total
            log(`🏆 Venceste a equipa inimiga!`);
            await calculateFinalScore(true);
        }
        return;
    }

    // Inimigo ataca após 1.5 segundos
    setTimeout(async () => {
        executeEnemyTurn();
    }, 1500);
}

// Realizar a troca de Pokémon (gasta o turno)
function performSwitch(newIndex) {
    playerIndex = newIndex;
    player = playerTeam[playerIndex];
    
    log(`Trocaste para ${player.name}!`);
    renderGame(); // Atualiza UI
    updateTeamIndicators();

    // Trocar gasta o turno, inimigo ataca
    toggleButtons(false);
    setTimeout(() => {
        executeEnemyTurn();
    }, 1500);
}

// Lógica centralizada do turno do inimigo
async function executeEnemyTurn() {
    const enemyDamage = calculateDamage(enemy, player);
    player.currentHp -= enemyDamage;
    animateDamage('player'); // Animar o jogador a receber dano
    if (player.currentHp < 0) player.currentHp = 0;

    updateHealthUI('player', player);
    log(`O Inimigo atacou ${player.name} e causou ${enemyDamage} dano!`);

    // Verificar derrota ou continuar
    if (player.currentHp === 0) {
        log(`${player.name} desmaiou...`);
        
        // Verificar se o jogador tem mais pokémons vivos
        const hasAlivePokemon = playerTeam.some(p => p.currentHp > 0);
        
        if (hasAlivePokemon) {
            setTimeout(() => {
                switchPlayerPokemon(); // Auto-switch para o próximo (ou lógica de escolha forçada)
                toggleButtons(true);
            }, 1500);
        } else {
            // Derrota Total
            log("💀 A tua equipa foi derrotada...");
            await calculateFinalScore(false);
        }
    } else {
        toggleButtons(true);
    }
}

// Trocar Pokémon do Jogador
function switchPlayerPokemon() {
    // Encontrar o próximo pokémon vivo
    const nextIndex = playerTeam.findIndex((p, i) => i > playerIndex && p.currentHp > 0);
    
    if (nextIndex !== -1) {
        playerIndex = nextIndex;
    } else {
        // Se não houver a seguir, procura desde o início
        playerIndex = playerTeam.findIndex(p => p.currentHp > 0);
    }

    player = playerTeam[playerIndex];
    log(`Vai, ${player.name}!`);
    renderGame(); // Atualiza a UI com o novo pokémon
    updateTeamIndicators();
}

// Trocar Pokémon do Inimigo
function switchEnemyPokemon() {
    enemyIndex++;
    enemy = enemyTeam[enemyIndex];
    log(`O inimigo enviou ${enemy.name}!`);
    renderGame(); // Atualiza a UI com o novo pokémon
    updateTeamIndicators();
}

// Atualizar bolinhas indicadoras de equipa
function updateTeamIndicators() {
    const pContainer = document.getElementById('player-team-indicator');
    const eContainer = document.getElementById('enemy-team-indicator');
    
    // Jogador: 🔵 vivo, ⚫ morto
    pContainer.innerHTML = playerTeam.map((p, i) => p.currentHp <= 0 ? '⚫' : '🔵').join('');
    
    // Inimigo: 🔴 vivo, ⚫ morto
    eContainer.innerHTML = enemyTeam.map((p, i) => p.currentHp <= 0 ? '⚫' : '🔴').join('');
}

async function calculateFinalScore(isVictory) {
    const points = isVictory ? 20 : -5;
    await updateScore(points);
    showRestartButton();
}

async function handleForfeit() {
    if (confirm("Tens a certeza que queres desistir? Perderás 5 pontos.")) {
        await updateScore(-5);
        window.location.href = '/index.html';
    }
}

// Objeto para definir fraquezas e resistências (Lógica de Pedra-Papel-Tesoura)
// Tabela de Tipos Simplificada
const TYPE_CHART = {
    fire: { weak: ['water', 'ground', 'rock'], strong: ['grass', 'ice', 'bug'] },
    water: { weak: ['electric', 'grass'], strong: ['fire', 'ground', 'rock'] },
    grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], strong: ['water', 'ground', 'rock'] },
    electric: { weak: ['ground'], strong: ['water', 'flying'] },
    normal: { weak: ['fighting'], strong: [] },
    // Adicionar outros tipos conforme necessário...
};

// Calcular dano baseado em ataque/defesa com variação aleatória
function calculateDamage(attacker, defender) {
    let multiplier = 1;
    
    // Verificar tipos (assumindo que attacker.types[0] é o tipo principal)
    const attType = attacker.types[0];
    const defType = defender.types[0];

    if (TYPE_CHART[attType]) {
        if (TYPE_CHART[attType].strong.includes(defType)) {
            multiplier = 2; // Super Efetivo
            setTimeout(() => log("🔥 É super efetivo!"), 500);
        } else if (TYPE_CHART[attType].weak.includes(defType)) {
            multiplier = 0.5; // Pouco Efetivo
            setTimeout(() => log("🛡️ Não é muito efetivo..."), 500);
        }
    }

    const baseDamage = ((attacker.attack / defender.defense) * 20) * multiplier;
    const random = (Math.random() * 0.4) + 0.8;
    return Math.floor(baseDamage * random);
}

// Atualizar barra de HP na interface
function updateHealthUI(type, pokemon) {
    const percent = (pokemon.currentHp / pokemon.maxHp) * 100;
    const bar = document.getElementById(`${type}-hp-bar`);
    bar.style.width = `${percent}%`;
    document.getElementById(`${type}-hp-text`).innerText = `${pokemon.currentHp}/${pokemon.maxHp}`;
    
    // HP baixo = barra vermelha
    if(percent < 20) {
        bar.classList.add('low');
    } else {
        bar.classList.remove('low');
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

// Função auxiliar para criar botão de reinício
function showRestartButton() {
    const container = document.getElementById('moves-container');
    container.innerHTML = ''; // Limpar botões de ataque
    
    const btn = document.createElement('button');
    btn.innerText = "Jogar Novamente";
    btn.className = "move-btn";
    btn.onclick = () => window.location.reload();
    container.appendChild(btn);
}

// Adiciona uma classe CSS temporária para animar o dano
function animateDamage(target) {
    const img = document.getElementById(`${target}-img`);
    if (img) {
        img.classList.add('shake-animation');
        // Remove a classe após 500ms para poder ser usada novamente
        setTimeout(() => img.classList.remove('shake-animation'), 500);
    }
}

// Event Listener para prevenir saída acidental da batalha
document.addEventListener('DOMContentLoaded', () => {
    // Usar delegação de eventos para detetar cliques na Navbar e outros links dinâmicos
    document.body.addEventListener('click', async (e) => {
        const link = e.target.closest('.sidebar-link, .main-navbar a');
        
        if (!link) return;

        const battleContainer = document.getElementById('main-container');
        
        // Verificar se estamos em batalha ativa
        // (Arena visível e ninguém morreu ainda)
        const isBattleVisible = battleContainer && battleContainer.style.display !== 'none';
        const isBattleOngoing = typeof player !== 'undefined' && typeof enemy !== 'undefined' && 
                                player.currentHp > 0 && enemy.currentHp > 0;

        if (isBattleVisible && isBattleOngoing) {
            e.preventDefault(); // Bloquear navegação
            
            const message = "⚠️ ALERTA DE BATALHA ⚠️\n\nSe saíres agora, será considerada uma desistência!\nPerderás 5 pontos no Hall of Fame.\n\nTens a certeza que queres sair?";

            if (confirm(message)) {
                // Aplicar penalização
                if (typeof updateScore === 'function') {
                    await updateScore(-5);
                }
                // Prosseguir com a navegação
                window.location.href = link.href;
            }
        }
    });
});