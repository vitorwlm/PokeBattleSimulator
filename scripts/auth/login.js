// [CTeSP] Módulo de Login
// Trata da autenticação comparando dados do formulário com a API.

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                // 1. Pedir lista de utilizadores à API (GET)
                // 'await' espera que a resposta chegue antes de continuar
                const response = await fetch(MOCK_API_URL);
                const users = await response.json();
                
                // 2. Procurar utilizador no array recebido
                // O método .find() devolve o primeiro elemento que satisfaz a condição
                const user = users.find(u => u.username === username && u.password === password);

                if (user) {
                    alert('Login bem-sucedido!');
                    // 3. Guardar sessão no navegador (LocalStorage)
                    // JSON.stringify converte o objeto JavaScript em Texto para poder ser guardado
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