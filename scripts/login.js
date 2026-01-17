document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(MOCK_API_URL);
                const users = await response.json();
                
                const user = users.find(u => u.username === username && u.password === password);

                if (user) {
                    alert('Login bem-sucedido!');
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    window.location.href = '/html/game.html'; 
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