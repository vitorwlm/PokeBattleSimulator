/**
 * [GESTÃO DE SESSÃO]
 * Protege páginas que requerem login (como o jogo).
 * Se não houver utilizador no localStorage, redireciona para o início.
 */
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
