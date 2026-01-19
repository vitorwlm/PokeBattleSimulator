/**
 * [CONFIGURAÇÃO DA BATALHA]
 * Gere a seleção de equipa e o carregamento inicial.
 */

let currentTeamSelection = [];

// Arrays para armazenar os dados da API e permitir filtragem local (sem novos pedidos à API)
let FILTERED_POKEMON = [];
let ALL_POKEMON_LIST = [];

// Filtra a lista de pokémons em tempo real enquanto o utilizador escreve
function filterPokemonByName(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    // Se a pesquisa estiver vazia, restaura a lista completa
    if (term === '') {
        FILTERED_POKEMON = [...ALL_POKEMON_LIST];
    } else {
        FILTERED_POKEMON = ALL_POKEMON_LIST.filter(p => {
            return p.name.toLowerCase().includes(term);
        });
    }
    displayPokemonGrid();
}

// Renderiza a grelha de seleção baseada na lista filtrada
function displayPokemonGrid() {
    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.innerHTML = '';

    if (FILTERED_POKEMON.length === 0) {
        pokemonList.innerHTML = '<p>Nenhum Pokémon encontrado</p>';
        return;
    }

    for (const pokemon of FILTERED_POKEMON) {
        const card = document.createElement('div');
        card.className = 'pokemon-choice';
        
        // Feedback visual: marca o card se já estiver na equipa
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

// Carrega a lista inicial de 151 Pokémons
async function showPokemonSelection() {
    const pokemonList = document.getElementById('pokemon-list');
    pokemonList.innerHTML = '<p>Carregando Pokémons da primeira geração...</p>';

    try {
        // OTIMIZAÇÃO: Fazemos apenas 1 pedido para obter a lista de nomes e URLs.
        // Não carregamos os detalhes (stats) agora para a página ser rápida.
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await res.json();
        
        // Mapeamos os dados para um formato mais simples
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

// Adiciona ou remove um Pokémon da equipa (limite de 3)
function selectPokemon(pokemonId) {
    const index = currentTeamSelection.indexOf(pokemonId);
    if (index !== -1) {
        removePokemonFromTeam(index);
        return;
    }

    if (currentTeamSelection.length >= 3) {
        alert("A tua equipa já está cheia! Remove um Pokémon ou inicia a batalha.");
        return;
    }

    currentTeamSelection.push(pokemonId);
    updateTeamUI();
    displayPokemonGrid();
}

// Atualiza a barra superior com as "bolas" dos pokémons selecionados
function updateTeamUI() {
    const container = document.getElementById('team-preview');
    const startBtn = document.getElementById('start-battle-btn');
    
    container.innerHTML = '';

    currentTeamSelection.forEach((id, index) => {
        const div = document.createElement('div');
        div.className = 'w-20 h-20 bg-gray-100 rounded-full border-2 border-blue-500 flex items-center justify-center cursor-pointer hover:bg-red-100';
        div.innerHTML = `<img src="${SPRITE_BASE_URL}${id}.png" class="w-16 h-16">`;
        div.onclick = () => removePokemonFromTeam(index);
        container.appendChild(div);
    });

    // Só mostra o botão de iniciar quando a equipa estiver completa (3)
    if (currentTeamSelection.length === 3) {
        startBtn.classList.remove('hidden');
    } else {
        startBtn.classList.add('hidden');
    }
}

function removePokemonFromTeam(index) {
    currentTeamSelection.splice(index, 1);
    updateTeamUI();
    displayPokemonGrid();
}

// Finaliza a seleção e inicia o modo de batalha
function startTeamBattle() {
    localStorage.setItem('selectedTeam', JSON.stringify(currentTeamSelection));
    document.getElementById('pokemon-selection').style.display = 'none';
    document.getElementById('main-container').style.display = 'block';
    initGame();
}

// Inicializa os dados da batalha (Carregamento Pesado)
async function initGame() {
    const selectedTeamIds = JSON.parse(localStorage.getItem('selectedTeam')) || [25, 4, 7];
    
    const enemyTeamIds = [
        Math.floor(Math.random() * 151) + 1,
        Math.floor(Math.random() * 151) + 1,
        Math.floor(Math.random() * 151) + 1
    ];

    // OTIMIZAÇÃO COM PROMISE.ALL:
    // Em vez de carregar um pokémon, esperar, carregar outro...
    // Disparamos os 3 pedidos ao mesmo tempo. É muito mais rápido.
    const playerTeamData = await Promise.all(
        selectedTeamIds.map(id => fetchPokemon(id))
    );

    // O mesmo para a equipa inimiga
    const enemyTeamData = await Promise.all(
        enemyTeamIds.map(id => fetchPokemon(id))
    );

    startBattleLogic(playerTeamData, enemyTeamData);

    log("Batalha iniciada! A tua vez.");
}

// Busca os detalhes completos de um Pokémon (Stats, Tipos, Sprites)
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
        types: data.types.map((t) => t.type.name),
    };
}


document.addEventListener('DOMContentLoaded', () => {
    showPokemonSelection();
    
    const searchInput = document.getElementById('pokemon-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterPokemonByName(e.target.value);
        });
    }
});
