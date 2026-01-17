// Verificar sessão no menu: se logado mostra "Jogar", senão mostra "Autenticação"
function checkMenuSession() {
    const currentUser = localStorage.getItem('currentUser');
    const loggedArea = document.getElementById('logged-area');
    const authBtn = document.getElementById('auth');
    const playBtn = document.getElementById('play-btn');
    const welcomeText = document.getElementById('welcome-text');

    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            document.getElementById('logged-username').textContent = user.username;
            loggedArea.style.display = 'block';
            authBtn.style.display = 'none';
            playBtn.style.display = 'inline-block';
            welcomeText.textContent = 'Bem-vindo de volta, ' + user.username + '!';
        } catch (error) {
            console.error('Erro ao carregar sessao:', error);
        }
    } else {
        // Utilizador não autenticado
        loggedArea.style.display = 'none';
        authBtn.style.display = 'inline-block';
        playBtn.style.display = 'none';
        welcomeText.textContent = 'Para começar a jogar, registre-se ou faça login.';
    }
}

function goToGame() {
    window.location.href = '/html/game.html';
}

function logoutFromMenu() {
    if (confirm('Tem a certeza que quer fazer logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('selectedPokemon');
        location.reload();
    }
}

document.addEventListener('DOMContentLoaded', checkMenuSession);
