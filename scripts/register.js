const MOCK_API_URL = 'https://69658367f6de16bde44a811e.mockapi.io/pks/Players'; 
const POKE_API_URL = 'https://pokeapi.co/api/v2/pokemon/';
//fazer com que quando clique no registar no register.html ele envie os dados para a mockapi.io
const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    let score = 0;

    try {
        const response = await fetch(MOCK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                username,
                password,
                score
            })
        });

        if (response.ok) {
            alert('Registado com sucesso!');
            window.location.href = '/game.html';
        } else {
            alert('Erro no registro: ' + response.statusText);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao contactar a API');
    }
});
