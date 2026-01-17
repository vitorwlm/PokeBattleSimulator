document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                // Buscar todos os utilizadores da MockAPI
                const response = await fetch(MOCK_API_URL);
                const users = await response.json();
                
                // Verificar se existe utilizador com credenciais correspondentes
                const user = users.find(u => u.username === username && u.password === password);

                if (user) {
                    alert('Login bem-sucedido!');
                    // Guardar dados do utilizador em localStorage para manter sessão
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    
                    // Se está em index.html, recarrega para mostrar área logada
                    if (document.getElementById('auth')) {
                        location.reload();
                    } else {
                        // Caso contrário vai para o jogo
                        window.location.href = '/html/game.html';
                    }
                } else {
                    alert('Credenciais inválidas. Tenta novamente.');
                }
            }
            catch (error) {
                console.error('Erro:', error);
                alert('Erro ao contactar a API');
            }
        });
    }
});