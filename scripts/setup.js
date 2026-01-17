
let player = {};
let enemy = {};

// Pokémon disponíveis para seleção inicial

let POKEMON_CHOICES = [];

for (let i = 1; i < 1025; i++ ){
    POKEMON_CHOICES.push(i);
}

// Carregar e mostrar grid de seleção de Pokémon
async function showPokemonSelection() {
    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.innerHTML = '<p>Carregando Pokémon...</p>';

    try {
        pokemonList.innerHTML = '';

        // Carregar cada Pokémon e criar card clicável
        for (const id of POKEMON_CHOICES) {
            try {
                const pokemon = await fetchPokemon(id);
                const card = document.createElement('div');
                card.className = 'pokemon-choice';
                card.innerHTML = `
                    <img src="${pokemon.sprite}" alt="${pokemon.name}" />
                    <p>${pokemon.name}</p>
                `;
                card.onclick = () => selectPokemon(id);
                pokemonList.appendChild(card);
            } catch (error) {
                console.error(`Erro ao carregar Pokémon ${id}:`, error);
            }
        }
    } catch (error) {
        console.error('Erro na seleção de Pokémon:', error);
        pokemonList.innerHTML = '<p style="color: red;">Erro ao carregar Pokémon</p>';
    }
}

// Guardar escolha e iniciar batalha
function selectPokemon(pokemonId) {
    localStorage.setItem('selectedPokemon', pokemonId);
    document.getElementById('pokemon-selection').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
    initGame();
}

// Inicializar batalha: carregar Pokémon do jogador (escolhido) e inimigo (aleatório)
async function initGame() {
    const selectedPokemon = localStorage.getItem('selectedPokemon') || 25;
    const randomId = Math.floor(Math.random() * 150) + 1;

    // Carregar ambos os Pokémon em paralelo
    const [playerData, enemyData] = await Promise.all([
        fetchPokemon(selectedPokemon),
        fetchPokemon(randomId),
    ]);

    player = playerData;
    enemy = enemyData;

    renderGame();
    log("Batalha iniciada! A tua vez.");
}

// Buscar dados do Pokémon da PokéAPI e extrair informações relevantes
async function fetchPokemon(idOrName) {
    const res = await fetch(`${POKE_API_URL}${idOrName}`);
    const data = await res.json();

    return {
        name: data.name.toUpperCase(),
        sprite: data.sprites.front_default,
        maxHp: data.stats[0].base_stat * 3,
        currentHp: data.stats[0].base_stat * 3,
        attack: data.stats[1].base_stat,
        defense: data.stats[2].base_stat,
        moves: data.moves.slice(0, 4).map((m) => m.move),
    };
}

// Renderizar interface de batalha: mostrar Pokémon, HP e botões de ataque
function renderGame() {
    document.getElementById("player-name").innerText = player.name;
    document.getElementById("player-img").src = player.sprite;
    updateHealthUI("player", player);

    document.getElementById("enemy-name").innerText = enemy.name;
    document.getElementById("enemy-img").src = enemy.sprite;
    updateHealthUI("enemy", enemy);

    // Criar botões para cada movimento disponível
    const movesContainer = document.getElementById("moves-container");
    movesContainer.innerHTML = "";

    player.moves.forEach((move) => {
        const btn = document.createElement("button");
        btn.innerText = move.name;
        btn.onclick = () => handleAttack(move);
        btn.className = "move-btn";
        movesContainer.appendChild(btn);
    });
}

document.addEventListener('DOMContentLoaded', showPokemonSelection);
