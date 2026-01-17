// [CTeSP] Configuração da Batalha
// Gere a seleção de equipa e o carregamento inicial de dados da API.

let currentTeamSelection = []; // Lista temporária para a seleção

// Pokémon disponíveis para seleção inicial (Primeira Geração: 1-151)

let FILTERED_POKEMON = [];
let ALL_POKEMON_LIST = []; // Lista leve apenas com nome e ID

// Filtrar Pokémon por nome
function filterPokemonByName(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    if (term === '') {
        FILTERED_POKEMON = [...ALL_POKEMON_LIST];
    } else {
        FILTERED_POKEMON = ALL_POKEMON_LIST.filter(p => {
            return p.name.toLowerCase().includes(term);
        });
    }
    displayPokemonGrid();
}

// Mostrar grid de Pokémons filtrados
function displayPokemonGrid() {
    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.innerHTML = '';

    if (FILTERED_POKEMON.length === 0) {
        pokemonList.innerHTML = '<p>Nenhum Pokémon encontrado</p>';
        return;
    }

    // Carregar cada Pokémon e criar card clicável
    for (const pokemon of FILTERED_POKEMON) {
        const card = document.createElement('div');
        card.className = 'pokemon-choice';
        
        if (currentTeamSelection.includes(pokemon.id)) {
            card.classList.add('selected');
        }

        card.innerHTML = `
            <img src="${SPRITE_BASE_URL}${pokemon.id}.png" alt="${pokemon.name}" loading="lazy" />
            <p>${pokemon.name}</p>
        `;
        card.onclick = () => selectPokemon(pokemon.id);
        pokemonList.appendChild(card);
    }
}

// Carregar e mostrar grid de seleção de Pokémon
async function showPokemonSelection() {
    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.innerHTML = '<p>Carregando Pokémons da primeira geração...</p>';

    try {
        // 1. Pedir lista de 151 Pokémons (1 único pedido é mais rápido)
        // Usamos a query string '?limit=151' para limitar os resultados
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await res.json();
        
        // Processar lista simples
        ALL_POKEMON_LIST = data.results.map((p, index) => ({
            name: p.name.toUpperCase(),
            url: p.url,
            id: index + 1
        }));
        
        FILTERED_POKEMON = [...ALL_POKEMON_LIST];
        displayPokemonGrid();

    } catch (error) {
        console.error('Erro na seleção de Pokémon:', error);
        pokemonList.innerHTML = '<p style="color: red;">Erro ao carregar Pokémon</p>';
    }
}

// Adicionar Pokémon à equipa
function selectPokemon(pokemonId) {
    // Verificar se já está na equipa (Se sim, clica para deselecionar)
    const index = currentTeamSelection.indexOf(pokemonId);
    if (index !== -1) {
        removePokemonFromTeam(index);
        return;
    }

    if (currentTeamSelection.length >= 3) {
        alert("A tua equipa já está cheia! Remove um Pokémon ou inicia a batalha.");
        return;
    }

    // Adicionar ID à lista
    currentTeamSelection.push(pokemonId);
    updateTeamUI();
    displayPokemonGrid(); // Atualizar visual da grelha
}

// Atualizar a visualização da equipa na seleção
function updateTeamUI() {
    const container = document.getElementById('team-preview');
    const startBtn = document.getElementById('start-battle-btn');
    
    container.innerHTML = '';

    currentTeamSelection.forEach((id, index) => {
        const div = document.createElement('div');
        div.className = 'w-20 h-20 bg-gray-100 rounded-full border-2 border-blue-500 flex items-center justify-center cursor-pointer hover:bg-red-100';
        div.innerHTML = `<img src="${SPRITE_BASE_URL}${id}.png" class="w-16 h-16">`;
        div.onclick = () => removePokemonFromTeam(index); // Clicar para remover
        container.appendChild(div);
    });

    // Mostrar botão de iniciar se tiver 3 pokémons
    if (currentTeamSelection.length === 3) {
        startBtn.classList.remove('hidden');
    } else {
        startBtn.classList.add('hidden');
    }
}

function removePokemonFromTeam(index) {
    currentTeamSelection.splice(index, 1);
    updateTeamUI();
    displayPokemonGrid(); // Atualizar visual da grelha para desbloquear o pokemon
}

function startTeamBattle() {
    localStorage.setItem('selectedTeam', JSON.stringify(currentTeamSelection));
    document.getElementById('pokemon-selection').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
    initGame();
}

// Inicializar batalha: carregar dados detalhados dos Pokémons
async function initGame() {
    const selectedTeamIds = JSON.parse(localStorage.getItem('selectedTeam')) || [25, 4, 7];
    
    // Gerar equipa inimiga aleatória (3 pokémons)
    const enemyTeamIds = [
        Math.floor(Math.random() * 151) + 1,
        Math.floor(Math.random() * 151) + 1,
        Math.floor(Math.random() * 151) + 1
    ];

    // [CTeSP] Carregamento de Dados
    // Passo 1: Carregar a minha equipa (Promise.all carrega os 3 ao mesmo tempo)
    const playerTeamData = await Promise.all(
        selectedTeamIds.map(id => fetchPokemon(id))
    );

    // Passo 2: Carregar a equipa inimiga
    const enemyTeamData = await Promise.all(
        enemyTeamIds.map(id => fetchPokemon(id))
    );

    startBattleLogic(playerTeamData, enemyTeamData);

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
        types: data.types.map((t) => t.type.name), // Guardar os tipos (ex: ['fire', 'flying'])
    };
}


document.addEventListener('DOMContentLoaded', () => {
    showPokemonSelection();
    
    // Configurar a barra de pesquisa de forma segura
    const searchInput = document.getElementById('pokemon-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterPokemonByName(e.target.value);
        });
    }
});
