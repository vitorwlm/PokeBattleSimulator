document.addEventListener('DOMContentLoaded', () => {

    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("reg-email").value;
            const username = document.getElementById("reg-username").value;
            const password = document.getElementById("reg-password").value;
            const score = 0;

            try {
                const checkResponse = await fetch(MOCK_API_URL);
                if (!checkResponse.ok) throw new Error("Erro ao verificar utilizadores");
                
                const users = await checkResponse.json();

                const userExists = users.find(
                    (u) => u.username === username || u.email === email
                );

                if (userExists) {
                    alert("Erro: O Email ou o Username ja estao registados!");
                    return;
                }

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