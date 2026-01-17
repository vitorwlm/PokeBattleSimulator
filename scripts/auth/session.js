// [CTeSP] Gestão de Sessão
// Verifica se existe um utilizador logado no LocalStorage.

// Verificar se o utilizador tem sessão ativa ao entrar em game.html
// Se não tiver, redireciona para login
function checkSession() {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        window.location.href = '/index.html';
        return;
    }
    
    try {
        const user = JSON.parse(currentUser);
        // Mostrar nome do utilizador na barra de sessão
        document.getElementById('user-info').textContent = 'Utilizador: ' + user.username;
    } catch (error) {
        console.error('Erro ao carregar sessao:', error);
        window.location.href = '/index.html';
    }
}

// Fazer logout: limpar dados e redirecionar para index.html
function logout() {
    if (confirm('Tem a certeza que quer fazer logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('selectedPokemon');
        window.location.href = '/index.html';
    }
}

document.addEventListener('DOMContentLoaded', checkSession);
