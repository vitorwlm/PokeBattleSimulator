/**
 * [AUTENTICAÇÃO - LOGIN]
 * Verifica as credenciais comparando com os dados da API.
 */
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                // 1. GET: Buscar todos os utilizadores
                const response = await fetch(MOCK_API_URL);
                const users = await response.json();
                
                // 2. Validar: Procurar se existe algum utilizador com este user E password
                // Usamos toLowerCase() no username para ignorar maiúsculas/minúsculas
                const user = users.find(u => u.username.toLowerCase() === username.toLowerCase() && u.password === password);

                if (user) {
                    alert('Login bem-sucedido!');
                    // Guardar sessão no navegador (LocalStorage)
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    
                    // Redirecionamento
                    if (document.getElementById('auth')) {
                        location.reload();
                    } else {
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