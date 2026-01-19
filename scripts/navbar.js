/**
 * [BARRA DE NAVEGAÇÃO DINÂMICA]
 * Este script gera o HTML da navbar via JavaScript.
 * MOTIVO: Evita copiar e colar o código da navbar em todas as páginas HTML.
 * Se quisermos mudar um link, mudamos apenas aqui.
 */
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.createElement('nav');
    nav.className = 'main-navbar';

    const brand = document.createElement('a');
    brand.className = 'nav-brand';
    brand.innerText = 'PokéBattle';
    brand.href = '/index.html';
    nav.appendChild(brand);

    const links = [
        { text: 'Início', href: '/index.html' },
        { text: 'Pokédex', href: '/html/pokedex.html' },
        { text: 'Hall of Fame', href: '/html/halloffame.html' }
    ];

    const ul = document.createElement('ul');
    ul.className = 'nav-links';

    links.forEach(link => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.innerText = link.text;
        a.href = link.href;

        // Lógica para destacar a página atual (Active State)
        // Compara o URL atual do navegador com o link do botão
        const currentPath = window.location.pathname;
        const normalizedPath = currentPath === '/' ? '/index.html' : currentPath;
        
        if (normalizedPath.toLowerCase() === link.href.toLowerCase()) {
            a.classList.add('active');
        }

        li.appendChild(a);
        ul.appendChild(li);
    });

    nav.appendChild(ul);

    // Verifica se há utilizador logado para mostrar o nome e botão de Logout
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
                // Limpeza de sessão: removemos os dados do localStorage
                localStorage.removeItem('currentUser');
                localStorage.removeItem('selectedPokemon');
                window.location.href = '/index.html';
            }
        };

        userDiv.appendChild(logoutBtn);
        nav.appendChild(userDiv);
    }

    // Insere a navbar no topo do body (antes de qualquer outro conteúdo)
    document.body.insertBefore(nav, document.body.firstChild);
});