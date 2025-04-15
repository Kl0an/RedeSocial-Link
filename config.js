document.addEventListener("DOMContentLoaded", () => {
    const nomeUsuarioInput = document.getElementById('nome-usuario');
    const emailUsuarioInput = document.getElementById('email-usuario');
    const salvarUsuarioButton = document.getElementById('salvar-usuario');

    const temaSelect = document.getElementById('tema');
    const notificacoesSelect = document.getElementById('notificacoes');
    const salvarConfiguracoesButton = document.getElementById('salvar-configuracoes');

    const privacidadeSelect = document.getElementById('privacidade');
    const salvarGeralButton = document.getElementById('salvar-geral');

    // Funções de salvar as configurações do usuário
    salvarUsuarioButton.addEventListener('click', () => {
        const nomeUsuario = nomeUsuarioInput.value.trim();
        const emailUsuario = emailUsuarioInput.value.trim();

        if (nomeUsuario && emailUsuario) {
            salvarNoLocalStorage('usuario', { nome: nomeUsuario, email: emailUsuario });
            alert('Configurações do usuário salvas!');
        } else {
            alert('Preencha todos os campos!');
        }
    });

    // Função para salvar tema e notificações
    salvarConfiguracoesButton.addEventListener('click', () => {
        const tema = temaSelect.value;
        const notificacoes = notificacoesSelect.value;

        salvarNoLocalStorage('configuracoes', { tema, notificacoes });
        aplicarTema(tema); // Função para aplicar o tema

        alert('Configurações da rede social salvas!');
    });

    // Função para salvar privacidade
    salvarGeralButton.addEventListener('click', () => {
        const privacidade = privacidadeSelect.value;
        salvarNoLocalStorage('geral', { privacidade });
        alert('Configurações gerais salvas!');
    });

    // Carregar configurações já salvas no LocalStorage
    carregarConfiguracoes();
});

function carregarConfiguracoes() {
    const usuario = recuperarDoLocalStorage('usuario');
    const configuracoes = recuperarDoLocalStorage('configuracoes');
    const geral = recuperarDoLocalStorage('geral');

    if (usuario) {
        document.getElementById('nome-usuario').value = usuario.nome;
        document.getElementById('email-usuario').value = usuario.email;
    }

    if (configuracoes) {
        document.getElementById('tema').value = configuracoes.tema;
        document.getElementById('notificacoes').value = configuracoes.notificacoes;
        aplicarTema(configuracoes.tema);
    }

    if (geral) {
        document.getElementById('privacidade').value = geral.privacidade;
    }
}
