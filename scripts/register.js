const MOCK_API_URL = "https://69658367f6de16bde44a811e.mockapi.io/pks/Players";

document.addEventListener('DOMContentLoaded', () => { 

    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            // ATENÇÃO: IDs atualizados para os campos de registo
            const email = document.getElementById("reg-email").value;
            const username = document.getElementById("reg-username").value;
            const password = document.getElementById("reg-password").value;
            const score = 0;

            try {
                // 1. Buscar utilizadores existentes
                const checkResponse = await fetch(MOCK_API_URL);
                if (!checkResponse.ok) throw new Error("Erro ao verificar utilizadores");
                
                const users = await checkResponse.json();

                // Verificar se JÁ EXISTE
                const userExists = users.find(
                    (u) => u.username === username || u.email === email
                );

                if (userExists) {
                    alert("Erro: O Email ou o Username já estão registados!");
                    return;
                }

                // 2. Se não existe, cria o novo utilizador
                const createResponse = await fetch(MOCK_API_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        username,
                        password,
                        score,
                    }),
                });

                if (createResponse.ok) {
                    alert("Registado com sucesso!");
                    // Redirecionar para o jogo
                    window.location.href = "game.html";
                } else {
                    alert("Erro ao criar conta: " + createResponse.statusText);
                }

            } catch (error) {
                console.error("Erro no processo:", error);
                alert("Ocorreu um erro ao comunicar com o servidor.");
            }
        });
    }
});