// Verificar sessão no menu: se logado mostra "Jogar", senão mostra "Autenticação"
function checkMenuSession() {
    const currentUser = localStorage.getItem('currentUser');
    const authBtn = document.getElementById('auth');
    const playBtn = document.getElementById('play-btn');
    const welcomeText = document.getElementById('welcome-text');

    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            authBtn.style.display = 'none';
            playBtn.style.display = 'inline-block';
            welcomeText.textContent = 'Bem-vindo de volta, ' + user.username + '!';
        } catch (error) {
            console.error('Erro ao carregar sessao:', error);
        }
    } else {
        // Utilizador não autenticado
        authBtn.style.display = 'inline-block';
        playBtn.style.display = 'none';
        welcomeText.textContent = 'Para começar a jogar, registre-se ou faça login.';
    }
}

function goToGame() {
    window.location.href = '/html/game.html';
}

document.addEventListener('DOMContentLoaded', checkMenuSession);
