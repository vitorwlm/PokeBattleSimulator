document.addEventListener('DOMContentLoaded', () => {
    // Selecionar os elementos pelo ID definido no index.html
    const authBtn = document.getElementById('auth');
    const modal = document.getElementById('auth-modal');

    // Verifica se os elementos existem para evitar erros
    if (authBtn && modal) {

        // 1. Abrir o modal quando se clica no botão "Autenticação"
        authBtn.addEventListener('click', () => {
            modal.classList.add('show');
        });

        // 2. Fechar o modal quando se clica na parte escura (fora do formulário)
        // O evento 'click' propaga-se; se o alvo for exatamente o fundo (.modal), fechamos.
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });

        // 3. (Opcional) Fechar o modal ao pressionar a tecla ESC
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                modal.classList.remove('show');
            }
        });
    }
});