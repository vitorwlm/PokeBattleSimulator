const MOCK_API_URL = 'https://69658367f6de16bde44a811e.mockapi.io/pks/Players';
document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevenir o reload da página

            // ATENÇÃO: IDs atualizados para corresponder ao novo HTML
            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            try {
                const response = await fetch(MOCK_API_URL);
                const users = await response.json();
                
                const user = users.find(u => u.username === username && u.password === password);

                if (user) {
                    alert('Login bem-sucedido!');
                    // Guardar sessão (opcional, mas útil)
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    
                    // Ajusta este caminho conforme a tua estrutura de pastas real
                    // Se o game.html está ao lado do index.html, usa apenas 'game.html'
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