/**
 * [MOTOR DE BATALHA]
 * Controla toda a lógica do jogo: turnos, dano, trocas e condições de vitória.
 */

let playerTeam = [];
let enemyTeam = [];
let player = {};
let enemy = {};
let playerIndex = 0;
let enemyIndex = 0;

// Inicializa as variáveis globais com as equipas carregadas
function startBattleLogic(pTeam, eTeam) {
    playerTeam = pTeam;
    enemyTeam = eTeam;
    playerIndex = 0;
    enemyIndex = 0;

    player = playerTeam[playerIndex];
    enemy = enemyTeam[enemyIndex];

    updateTeamIndicators();
    renderGame();
}

// Atualiza a Interface (DOM) com os dados atuais dos objetos player/enemy
function renderGame() {
    document.getElementById("player-name").innerText = player.name;
    document.getElementById("player-img").src = player.sprite;
    updateHealthUI("player", player);

    document.getElementById("enemy-name").innerText = enemy.name;
    document.getElementById("enemy-img").src = enemy.sprite;
    updateHealthUI("enemy", enemy);

    renderBattleMenu();
}

// Gera os botões do menu principal dinamicamente
function renderBattleMenu() {
    const container = document.getElementById('moves-container');
    if (!container) return;
    container.innerHTML = '';

    const btnFight = document.createElement('button');
    btnFight.innerText = "⚔️ Batalhar";
    btnFight.className = "move-btn";
    btnFight.onclick = () => showMoves();
    container.appendChild(btnFight);

    const btnSwitch = document.createElement('button');
    btnSwitch.innerText = "🔄 Trocar Pokémon";
    btnSwitch.className = "move-btn";
    btnSwitch.onclick = () => showSwitchMenu();
    container.appendChild(btnSwitch);

    const btnRun = document.createElement('button');
    btnRun.innerText = "🏳️ Desistir";
    btnRun.className = "move-btn";
    btnRun.style.backgroundColor = "#ef4444";
    btnRun.style.color = "white";
    btnRun.onclick = () => handleForfeit();
    container.appendChild(btnRun);
}

// Mostra os 4 ataques do Pokémon atual
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

    addBackButton(container);
}

// Mostra a lista de pokémons para troca
function showSwitchMenu() {
    const container = document.getElementById('moves-container');
    container.innerHTML = '';

    playerTeam.forEach((p, index) => {
        const btn = document.createElement('button');
        btn.innerText = `${p.name} (${p.currentHp}/${p.maxHp})`;
        btn.className = "move-btn";

        // Desativa o botão se for o pokémon atual ou se estiver desmaiado (HP <= 0)
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
    btnBack.style.backgroundColor = "#9ca3af";
    btnBack.onclick = () => renderBattleMenu();
    container.appendChild(btnBack);
}

// LÓGICA DE ATAQUE (TURNO DO JOGADOR)
async function handleAttack(move) {
    toggleButtons(false); // Bloqueia botões para evitar cliques múltiplos

    const damage = calculateDamage(player, enemy);
    enemy.currentHp -= damage;
    animateDamage('enemy');
    if (enemy.currentHp < 0) enemy.currentHp = 0;

    updateHealthUI('enemy', enemy);
    log(`${player.name} usou ${move.name} e causou ${damage} dano!`);

    // Verifica se o inimigo desmaiou
    if (enemy.currentHp === 0) {
        log(`${enemy.name} desmaiou!`);

        if (enemyIndex < enemyTeam.length - 1) {
            // Se ainda houver inimigos, troca automaticamente após 1.5s
            setTimeout(() => {
                switchEnemyPokemon();
                toggleButtons(true);
            }, 1500);
        } else {
            log(`🏆 Venceste a equipa inimiga!`);
            await calculateFinalScore(true);
        }
        return;
    }

    // Se o inimigo sobreviveu, é a vez dele atacar (após delay para leitura)
    setTimeout(async () => {
        executeEnemyTurn();
    }, 1500);
}

// Realiza a troca de Pokémon (gasta o turno)
function performSwitch(newIndex) {
    playerIndex = newIndex;
    player = playerTeam[playerIndex];

    log(`Trocaste para ${player.name}!`);
    renderGame();
    updateTeamIndicators();

    // Trocar conta como uma ação, logo o inimigo ataca a seguir
    toggleButtons(false);
    setTimeout(() => {
        executeEnemyTurn();
    }, 1500);
}

// LÓGICA DE IA (TURNO DO INIMIGO)
async function executeEnemyTurn() {
    const enemyDamage = calculateDamage(enemy, player);
    player.currentHp -= enemyDamage;
    animateDamage('player');
    if (player.currentHp < 0) player.currentHp = 0;

    updateHealthUI('player', player);
    log(`O Inimigo atacou ${player.name} e causou ${enemyDamage} dano!`);

    // Verifica se o jogador perdeu
    if (player.currentHp === 0) {
        log(`${player.name} desmaiou...`);

        const hasAlivePokemon = playerTeam.some(p => p.currentHp > 0);

        // Auto-switch se houver pokémons vivos, senão Game Over
        if (hasAlivePokemon) {
            setTimeout(() => {
                switchPlayerPokemon();
                toggleButtons(true);
            }, 1500);
        } else {
            log("💀 A tua equipa foi derrotada...");
            await calculateFinalScore(false);
        }
    } else {
        toggleButtons(true);
    }
}

// Troca automática para o próximo pokémon vivo do jogador
function switchPlayerPokemon() {
    const nextIndex = playerTeam.findIndex((p, i) => i > playerIndex && p.currentHp > 0);

    if (nextIndex !== -1) {
        playerIndex = nextIndex;
    } else {
        playerIndex = playerTeam.findIndex(p => p.currentHp > 0);
    }

    player = playerTeam[playerIndex];
    log(`Vai, ${player.name}!`);
    renderGame();
    updateTeamIndicators();
}

// Troca automática do inimigo
function switchEnemyPokemon() {
    enemyIndex++;
    enemy = enemyTeam[enemyIndex];
    log(`O inimigo enviou ${enemy.name}!`);
    renderGame();
    updateTeamIndicators();
}

// Atualiza as "bolinhas" (🔴/🔵) que indicam quantos pokémons restam
function updateTeamIndicators() {
    const pContainer = document.getElementById('player-team-indicator');
    const eContainer = document.getElementById('enemy-team-indicator');

    pContainer.innerHTML = playerTeam.map((p, i) => p.currentHp <= 0 ? '⚫' : '🔵').join('');

    eContainer.innerHTML = enemyTeam.map((p, i) => p.currentHp <= 0 ? '⚫' : '🔴').join('');
}

// Calcula pontuação final e atualiza o Hall of Fame
async function calculateFinalScore(isVictory) {
    const points = isVictory ? 20 : -5;
    await updateScore(points);
    showRestartButton();
}

// Lógica de desistência
async function handleForfeit() {
    if (confirm("Tens a certeza que queres desistir? Perderás 5 pontos.")) {
        await updateScore(-5);
        window.location.href = '/index.html';
    }
}

// Tabela de Tipos (Simplificada) para cálculo de vantagens
const TYPE_CHART = {
    fire: { weak: ['water', 'ground', 'rock'], strong: ['grass', 'ice', 'bug'] },
    water: { weak: ['electric', 'grass'], strong: ['fire', 'ground', 'rock'] },
    grass: { weak: ['fire', 'ice', 'poison', 'flying', 'bug'], strong: ['water', 'ground', 'rock'] },
    electric: { weak: ['ground'], strong: ['water', 'flying'] },
    normal: { weak: ['fighting'], strong: [] },
};

// Fórmula de Dano: (Ataque / Defesa) * Multiplicador de Tipo * Fator Aleatório
function calculateDamage(attacker, defender) {
    let multiplier = 1;

    const attType = attacker.types[0];
    const defType = defender.types[0];

    // Verifica fraquezas e resistências
    if (TYPE_CHART[attType]) {
        if (TYPE_CHART[attType].strong.includes(defType)) {
            multiplier = 2;
            setTimeout(() => log("🔥 É super efetivo!"), 500);
        } else if (TYPE_CHART[attType].weak.includes(defType)) {
            multiplier = 0.5;
            setTimeout(() => log("🛡️ Não é muito efetivo..."), 500);
        }
    }

    const baseDamage = ((attacker.attack / defender.defense) * 20) * multiplier;
    const random = (Math.random() * 0.4) + 0.8;
    return Math.floor(baseDamage * random);
}

// Atualiza visualmente a barra de vida (largura e cor)
function updateHealthUI(type, pokemon) {
    const percent = (pokemon.currentHp / pokemon.maxHp) * 100;
    const bar = document.getElementById(`${type}-hp-bar`);
    bar.style.width = `${percent}%`;
    document.getElementById(`${type}-hp-text`).innerText = `${pokemon.currentHp}/${pokemon.maxHp}`;

    if (percent < 20) {
        bar.classList.add('low');
    } else {
        bar.classList.remove('low');
    }
}

function log(message) {
    document.getElementById('battle-log').innerText = message;
}

function toggleButtons(enable) {
    const btns = document.querySelectorAll('.move-btn');
    btns.forEach(btn => btn.disabled = !enable);
}

function showRestartButton() {
    const container = document.getElementById('moves-container');
    container.innerHTML = '';

    const btn = document.createElement('button');
    btn.innerText = "Jogar Novamente";
    btn.className = "move-btn";
    btn.onclick = () => window.location.reload();
    container.appendChild(btn);
}

// Adiciona classe CSS temporária para efeito visual de "tremor"
function animateDamage(target) {
    const img = document.getElementById(`${target}-img`);
    if (img) {
        img.classList.add('shake-animation');
        setTimeout(() => img.classList.remove('shake-animation'), 500);
    }
}

// Prevenção de saída acidental durante a batalha
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', async (e) => {
        const link = e.target.closest('.sidebar-link, .main-navbar a');

        if (!link) return;

        const battleContainer = document.getElementById('main-container');

        const isBattleVisible = battleContainer && battleContainer.style.display !== 'none';
        const isBattleOngoing = typeof player !== 'undefined' && typeof enemy !== 'undefined' &&
            player.currentHp > 0 && enemy.currentHp > 0;

        if (isBattleVisible && isBattleOngoing) {
            e.preventDefault();

            const message = "⚠️ ALERTA DE BATALHA ⚠️\n\nSe saíres agora, será considerada uma desistência!\nPerderás 5 pontos no Hall of Fame.\n\nTens a certeza que queres sair?";

            if (confirm(message)) {
                if (typeof updateScore === 'function') {
                    await updateScore(-5);
                }
                window.location.href = link.href;
            }
        }
    });
});