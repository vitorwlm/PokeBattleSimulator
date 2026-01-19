document.addEventListener('DOMContentLoaded', () => {
    // O CSS da Navbar foi movido para o <head> dos ficheiros HTML para evitar o efeito de "flicker"
    // 2. Criar a estrutura HTML da Navbar
    const nav = document.createElement('nav');
    nav.className = 'main-navbar';

    // 2.1. Marca / Logo (Esquerda)
    const brand = document.createElement('a');
    brand.className = 'nav-brand';
    brand.innerText = 'PokéBattle';
    brand.href = '/index.html';
    nav.appendChild(brand);

    // Definir os links (Ajuste os caminhos se necessário)
    const links = [
        { text: 'Início', href: '/index.html' },
        { text: 'Pokédex', href: '/html/pokedex.html' },
        { text: 'Hall of Fame', href: '/html/halloffame.html' }
    ];

    // 2.2. Links (Centro)
    const ul = document.createElement('ul');
    ul.className = 'nav-links';

    links.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.innerText = link.text;
        a.href = link.href;

        // Adicionar classe 'active' se for a página atual
        const currentPath = window.location.pathname;
        // Normalizar caminhos para garantir match correto
        const normalizedPath = currentPath === '/' ? '/index.html' : currentPath;
        
        if (normalizedPath.toLowerCase() === link.href.toLowerCase()) {
            a.classList.add('active');
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.appendChild(ul);

    // 2.3. Secção de utilizador (Direita)
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        
        const userDiv = document.createElement('div');
        userDiv.className = 'nav-user-section';
        
        userDiv.innerHTML = `
            <span>👤 ${user.username}</span>
        `;

        const logoutBtn = document.createElement('button');
        logoutBtn.innerText = 'SAIR';
        logoutBtn.onclick = () => {
            if (confirm('Tem a certeza que quer fazer logout?')) {
                localStorage.removeItem('currentUser');
                localStorage.removeItem('selectedPokemon');
                window.location.href = '/index.html';
            }
        };

        userDiv.appendChild(logoutBtn);
        nav.appendChild(userDiv);
    }

    // 3. Adicionar ao início do body
    document.body.insertBefore(nav, document.body.firstChild);
});