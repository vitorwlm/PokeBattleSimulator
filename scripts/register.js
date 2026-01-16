const MOCK_API_URL = "https://69658367f6de16bde44a811e.mockapi.io/pks/Players";

const registerForm = document.getElementById("register-form");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Impede a página de recarregar

  const email = document.getElementById("email").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const score = 0;

  try {
    // 1. Buscar utilizadores existentes
    const checkResponse = await fetch(MOCK_API_URL);

    if (!checkResponse.ok) throw new Error("Erro ao verificar utilizadores");

    const users = await checkResponse.json();

    // Queremos saber se JÁ EXISTE aquele email OU aquele username
    const userExists = users.find(
      (u) => u.username === username || u.email === email
    );

    if (userExists) {
      alert("Erro: O Email ou o Username já estão registados!");
      return; // Pára a execução aqui
    }

    // 3. Se não existe, cria o novo utilizador
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
      // Nota: Removi a barra inicial "/" para funcionar melhor localmente
      window.location.href = "/html/game.html";
    } else {
      alert("Erro ao criar conta: " + createResponse.statusText);
    }

  } catch (error) {
    console.error("Erro no processo:", error);
    alert("Ocorreu um erro ao comunicar com o servidor.");
  }
});