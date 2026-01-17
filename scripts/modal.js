document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('auth');
    const modal = document.getElementById('auth-modal');

    if (authBtn && modal) {
        // Abrir modal ao clicar no botão
        authBtn.addEventListener('click', () => {
            modal.classList.add('show');
        });

        // Fechar modal ao clicar fora (no fundo escuro)
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });

        // Fechar modal com a tecla ESC
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                modal.classList.remove('show');
            }
        });
    }
});