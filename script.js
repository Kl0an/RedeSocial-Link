document.addEventListener("DOMContentLoaded", function() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const temaButton = document.getElementById('alternar-tema');
    const body = document.body;
    const mensagemContainer = document.getElementById('mensagem-container');
    const enviarMensagemButton = document.getElementById('enviar-mensagem');
    const mensagemInput = document.getElementById('mensagem');

    // Alternar abas
    tabLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const targetTab = link.dataset.tab;
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.classList.add('hidden');
            });
            const targetContent = document.getElementById(targetTab);
            targetContent.classList.add('active');
            targetContent.classList.remove('hidden');
        });
    });

    // Alternar tema claro/escuro
    temaButton.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
    });

    // Envio de mensagem
    enviarMensagemButton.addEventListener('click', function() {
        const mensagemText = mensagemInput.value;
        if (mensagemText.trim()) {
            const dataHora = new Date().toLocaleString();
            const novaMensagem = document.createElement('p');
            novaMensagem.textContent = `[${dataHora}] ${mensagemText}`;
            mensagemContainer.appendChild(novaMensagem);
            mensagemInput.value = '';
        }
    });
});
