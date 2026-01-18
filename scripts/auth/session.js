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
        JSON.parse(currentUser);
    } catch (error) {
        console.error('Erro ao carregar sessao:', error);
        window.location.href = '/index.html';
    }
}

document.addEventListener('DOMContentLoaded', checkSession);
