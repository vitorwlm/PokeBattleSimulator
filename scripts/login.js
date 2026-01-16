const MOCK_API_URL = 'https://69658367f6de16bde44a811e.mockapi.io/pks/Players';
const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon/';

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();//prevenir o reload da pagina
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Verificar credenciais na Mock
    try {
        const response = await fetch(MOCK_API_URL);
        const users = await response.json();
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            alert('Login bem-sucedido!');
            window.location.href = '/game.html';
        } else {
            alert('Credenciais inválidas. Tenta novamente.');
        }
    }
    catch (error) {
        console.error('Erro:', error);
        alert('Erro ao contactar a API');
    }
});