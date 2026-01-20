/**
 * [AUTENTICAÇÃO - REGISTO]
 * Cria novos utilizadores e inicializa o seu registo no ranking.
 */
document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("reg-email").value;
            const username = document.getElementById("reg-username").value;
            const password = document.getElementById("reg-password").value;

            try {
                // 1. Validação: Verificar se o utilizador já existe antes de criar
                const checkResponse = await fetch(MOCK_API_URL);
                if (!checkResponse.ok) throw new Error("Erro ao verificar utilizadores");

                const users = await checkResponse.json();
                // .find() retorna o primeiro elemento que satisfaz a condição
                const userExists = users.find(
                    (u) => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
                );

                if (userExists) {
                    alert("Erro: O Email ou o Username ja estao registados!");
                    return;
                }

                // 2. POST: Criar a conta na tabela 'Players'
                const createResponse = await fetch(MOCK_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        username,
                        password,
                    }),
                });

                if (createResponse.ok) {
                    const newUser = await createResponse.json();

                    // 3. POST: Criar entrada inicial na tabela 'HallOfFame'
                    // Ligamos as duas tabelas através do 'playerId'
                    await fetch(MOCK_API_URL_HALL, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ playerId: newUser.id, username: newUser.username, score: 0 })
                    });

                    // Login automático após registo
                    localStorage.setItem('currentUser', JSON.stringify(newUser));
                    alert("Registado com sucesso!");
                    window.location.href = "/html/game.html";
                } else {
                    alert("Erro ao criar conta: " + createResponse.statusText);
                }

            } catch (error) {
                console.error("Erro:", error);
                alert("Erro ao comunicar com o servidor.");
            }
        });
    }
});