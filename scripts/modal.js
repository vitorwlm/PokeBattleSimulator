/**
 * [CONTROLO DE MODAL]
 * Gere a abertura e fecho das janelas pop-up (Login/Registo).
 */
document.addEventListener('DOMContentLoaded', () => {
    const authBtn = document.getElementById('auth');
    const modal = document.getElementById('auth-modal');

    if (authBtn && modal) {
        authBtn.addEventListener('click', () => {
            modal.classList.add('show');
        });

        // Fechar ao clicar fora da caixa (no fundo escuro)
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });

        // Acessibilidade: Fechar com a tecla ESC
        window.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                modal.classList.remove('show');
            }
        });
    }
});