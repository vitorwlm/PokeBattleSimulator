const MOCK_API_URL = 'https://69658367f6de16bde44a811e.mockapi.io/pks/Players'; 
const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon/';

let player = {};
let enemy = {};

// --- INICIALIZAÇÃO ---
async function initGame() {
    
    // Carregar Jogador (Ex: Pikachu) e Inimigo Aleatório
    const randomId = Math.floor(Math.random() * 150) + 1;
    
    // Promessas paralelas para ser mais rápido
    const [playerData, enemyData] = await Promise.all([
        fetchPokemon('xerneas'),      // Podes mudar o pokemon do jogador aqui
        fetchPokemon(randomId)
    ]);

    player = playerData;
    enemy = enemyData;

    renderGame();
    log("Batalha iniciada! A tua vez.");
}

// Buscar dados da PokéAPI
async function fetchPokemon(idOrName) {
    const res = await fetch(`${POKE_API_URL}${idOrName}`);
    const data = await res.json();
    
    return {
        name: data.name.toUpperCase(),
        sprite: data.sprites.front_default,
        maxHp: data.stats[0].base_stat * 3, // Multipliquei por 3 para a batalha durar mais
        currentHp: data.stats[0].base_stat * 3,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        moves: data.moves.slice(0, 4).map(m => m.move) // Pegar apenas 4 ataques
    };
}

// Atualizar o HTML com os dados
function renderGame() {
    // Jogador
    document.getElementById('player-name').innerText = player.name;
    document.getElementById('player-img').src = player.sprite; // Nota: para jogador idealmente usamos back_default
    updateHealthUI('player', player);

    // Inimigo
    document.getElementById('enemy-name').innerText = enemy.name;
    document.getElementById('enemy-img').src = enemy.sprite;
    updateHealthUI('enemy', enemy);

    // Criar Botões de Ataque
    const movesContainer = document.getElementById('moves-container');
    movesContainer.innerHTML = ''; // Limpar botões antigos
    
    player.moves.forEach(move => {
        const btn = document.createElement('button');
        btn.innerText = move.name;
        btn.onclick = () => handleAttack(move);
        btn.className = 'move-btn';
        movesContainer.appendChild(btn);
    });
}
initGame();