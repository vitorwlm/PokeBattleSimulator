/**
 * [POKÉDEX]
 * Lista todos os pokémons e mostra detalhes em um modal.
 */

let allPokemon = [];

async function initPokedex() {
    const grid = document.getElementById('pokedex-grid');
    
    try {
        // OTIMIZAÇÃO: Buscar lista leve (apenas nomes e urls) num único pedido.
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await res.json();
        
        allPokemon = data.results.map((p, index) => ({
            name: p.name,
            url: p.url,
            id: index + 1
        }));
        
        renderGrid(allPokemon);

        // Filtro de pesquisa em tempo real
        document.getElementById('pokedex-search').addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            const filtered = allPokemon.filter(p => 
                p.name.includes(term) || p.id.toString() === term
            );
            renderGrid(filtered);
        });

    } catch (error) {
        grid.innerHTML = '<p>Erro ao carregar Pokédex.</p>';
    }
}

// Renderiza os cartões simples na grelha
function renderGrid(list) {
    const grid = document.getElementById('pokedex-grid');
    grid.innerHTML = '';

    list.forEach(pokemon => {
        const card = document.createElement('div');
        card.className = 'poke-card';
        // loading="lazy" ajuda na performance ao não carregar imagens fora do ecrã
        card.innerHTML = `
            <img src="${SPRITE_BASE_URL}${pokemon.id}.png" alt="${pokemon.name}" loading="lazy">
            <p>#${pokemon.id} ${pokemon.name}</p>
        `;
        card.onclick = () => loadAndShowDetails(pokemon);
        grid.appendChild(card);
    });
}

// LAZY LOADING DE DETALHES:
// Só fazemos o fetch dos dados pesados (stats, descrição) quando o utilizador clica.
async function loadAndShowDetails(partialPokemon) {
    const modal = document.getElementById('pokedex-modal');
    const container = document.getElementById('pokemon-details');
    
    modal.style.display = 'flex';
    container.innerHTML = '<p>A ler dados da Pokébola...</p>';

    try {
        // 1. Fetch detalhes do Pokémon
        const res = await fetch(partialPokemon.url);
        const pokemon = await res.json();

        // 2. Fetch descrição (endpoint separado 'species')
        const speciesRes = await fetch(pokemon.species.url);
        const speciesData = await speciesRes.json();
        const description = speciesData.flavor_text_entries.find(e => e.language.name === 'en').flavor_text;

        container.innerHTML = `
            <div class="details-header">
                <img src="${pokemon.sprites.other['official-artwork'].front_default}" alt="${pokemon.name}">
                <div>
                    <h2 style="text-transform: capitalize; margin: 0;">${pokemon.name}</h2>
                    <p style="color: #3b4cca; font-weight: bold;">${pokemon.types.map(t => t.type.name).join(' / ')}</p>
                </div>
            </div>
            <div class="description">${description.replace(/\f/g, ' ')}</div>
            
            <div class="stats-container">
                ${pokemon.stats.map(stat => `
                    <div class="stat-row">
                        <div class="stat-label">${stat.stat.name}: ${stat.base_stat}</div>
                        <div class="stat-bar-bg">
                            <div class="stat-bar-fill" style="width: 0%" data-width="${(stat.base_stat / 150) * 100}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="margin-top: 20px; text-align: left;">
                <strong>Ataques Principais:</strong>
                <p style="font-size: 0.9rem; color: #666;">${pokemon.moves.slice(0, 5).map(m => m.move.name).join(', ')}</p>
            </div>
        `;

        // Pequeno delay para permitir que a animação CSS da barra de stats funcione
        setTimeout(() => {
            document.querySelectorAll('.stat-bar-fill').forEach(bar => {
                bar.style.width = bar.getAttribute('data-width');
            });
        }, 100);

    } catch (error) {
        container.innerHTML = '<p>Erro ao carregar detalhes.</p>';
    }
}

// Event Listeners para fechar o modal
document.querySelector('.close-modal').onclick = () => {
    document.getElementById('pokedex-modal').style.display = 'none';
};

window.onclick = (e) => {
    if (e.target.id === 'pokedex-modal') document.getElementById('pokedex-modal').style.display = 'none';
};

initPokedex();