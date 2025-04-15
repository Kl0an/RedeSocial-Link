document.addEventListener("DOMContentLoaded", function () {
    const contatosLista = document.getElementById('contatos-lista');
    const chatMensagens = document.getElementById('chat-mensagens');
    const nomeContato = document.getElementById('nome-contato');
    const enviarMensagemButton = document.getElementById('enviar-mensagem');
    const mensagemInput = document.getElementById('mensagem');

    const gravarAudioButton = document.getElementById('gravar-audio');
    const enviarFotoInput = document.getElementById('enviar-foto');
    const botaoFoto = document.getElementById('botao-foto');
    const enviarVideoInput = document.getElementById('enviar-video');
    const botaoVideo = document.getElementById('botao-video');

    let contatoAtual = '';
    let mediaRecorder;
    let audioChunks = [];
    let gravando = false;

    // Funções para salvar e recuperar mensagens do localStorage
    function salvarMensagens(contato, mensagens) {
        localStorage.setItem('mensagens_' + contato, JSON.stringify(mensagens));
    }

    function recuperarMensagens(contato) {
        const mensagens = localStorage.getItem('mensagens_' + contato);
        return mensagens ? JSON.parse(mensagens) : [];
    }

    // Atualizar uma mensagem específica
    function atualizarMensagem(contato, index, novaMensagem) {
        const mensagens = recuperarMensagens(contato);
        mensagens[index] = novaMensagem;
        salvarMensagens(contato, mensagens);
        exibirMensagens(mensagens);
    }

    // Remover uma mensagem específica
    function removerMensagem(contato, index) {
        const mensagens = recuperarMensagens(contato);
        mensagens.splice(index, 1);
        salvarMensagens(contato, mensagens);
        exibirMensagens(mensagens);
    }

    // Exibir mensagens na interface
    function exibirMensagens(mensagens) {
        chatMensagens.innerHTML = '';
        mensagens.forEach((msg, index) => {
            const mensagemDiv = document.createElement('div');
            mensagemDiv.classList.add('mensagem');
            if (msg.marcada) {
                mensagemDiv.classList.add('marcada');
            }

            const conteudoDiv = document.createElement('div');
            conteudoDiv.classList.add('conteudo-mensagem');

            if (msg.tipo === 'texto') {
                const mensagemParagrafo = document.createElement('p');
                mensagemParagrafo.textContent = msg.conteudo;
                conteudoDiv.appendChild(mensagemParagrafo);
            } else if (msg.tipo === 'audio') {
                const audioElem = document.createElement('audio');
                audioElem.controls = true;
                audioElem.src = msg.conteudo;
                conteudoDiv.appendChild(audioElem);
            } else if (msg.tipo === 'foto') {
                const imgElem = document.createElement('img');
                imgElem.src = msg.conteudo;
                imgElem.style.maxWidth = '200px';
                imgElem.style.borderRadius = '8px';
                conteudoDiv.appendChild(imgElem);
            } else if (msg.tipo === 'video') {
                const videoElem = document.createElement('video');
                videoElem.controls = true;
                videoElem.src = msg.conteudo;
                videoElem.style.maxWidth = '300px';
                videoElem.style.borderRadius = '8px';
                conteudoDiv.appendChild(videoElem);
            }

            mensagemDiv.appendChild(conteudoDiv);

            // Controles da mensagem: Editar, Apagar, Marcar
            const controlesDiv = document.createElement('div');
            controlesDiv.classList.add('controles-mensagem');

            // Botão Editar (apenas para texto)
            if (msg.tipo === 'texto') {
                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.addEventListener('click', () => {
                    editarMensagem(index, msg);
                });
                controlesDiv.appendChild(btnEditar);
            }

            // Botão Apagar
            const btnApagar = document.createElement('button');
            btnApagar.textContent = 'Apagar';
            btnApagar.addEventListener('click', () => {
                if (confirm('Tem certeza que deseja apagar esta mensagem?')) {
                    removerMensagem(contatoAtual, index);
                }
            });
            controlesDiv.appendChild(btnApagar);

            // Botão Marcar
            const btnMarcar = document.createElement('button');
            btnMarcar.textContent = msg.marcada ? 'Desmarcar' : 'Marcar';
            btnMarcar.addEventListener('click', () => {
                msg.marcada = !msg.marcada;
                atualizarMensagem(contatoAtual, index, msg);
            });
            controlesDiv.appendChild(btnMarcar);

            mensagemDiv.appendChild(controlesDiv);

            // Data/hora
            const horaSpan = document.createElement('div');
            horaSpan.classList.add('hora');
            horaSpan.textContent = msg.dataHora;
            mensagemDiv.appendChild(horaSpan);

            chatMensagens.appendChild(mensagemDiv);
        });
        chatMensagens.scrollTop = chatMensagens.scrollHeight;
    }

    // Função para editar mensagem de texto
    function editarMensagem(index, msg) {
        const mensagemDivs = chatMensagens.children;
        const mensagemDiv = mensagemDivs[index];
        const conteudoDiv = mensagemDiv.querySelector('.conteudo-mensagem');
        conteudoDiv.innerHTML = '';

        const inputEditar = document.createElement('input');
        inputEditar.type = 'text';
        inputEditar.value = msg.conteudo;
        inputEditar.style.width = '80%';

        const btnSalvar = document.createElement('button');
        btnSalvar.textContent = 'Salvar';

        btnSalvar.addEventListener('click', () => {
            const novoTexto = inputEditar.value.trim();
            if (novoTexto) {
                msg.conteudo = novoTexto;
                atualizarMensagem(contatoAtual, index, msg);
            }
        });

        conteudoDiv.appendChild(inputEditar);
        conteudoDiv.appendChild(btnSalvar);
    }

    // Selecionar contato
    contatosLista.addEventListener('click', function (e) {
        if (e.target.tagName === 'LI') {
            contatoAtual = e.target.getAttribute('data-contato');
            nomeContato.textContent = contatoAtual;
            const mensagens = recuperarMensagens(contatoAtual);
            exibirMensagens(mensagens);
        }
    });

    function enviarMensagemTexto() {
        const mensagemText = mensagemInput.value.trim();

        if (mensagemText && contatoAtual) {
            const dataHora = new Date().toLocaleString();
            const mensagens = recuperarMensagens(contatoAtual);

            const novaMensagem = {
                tipo: 'texto',
                conteudo: mensagemText,
                dataHora: dataHora,
                marcada: false
            };

            mensagens.push(novaMensagem);
            salvarMensagens(contatoAtual, mensagens);
            exibirMensagens(mensagens);

            mensagemInput.value = '';  // Limpar o campo de mensagem
        } else if (!contatoAtual) {
            alert('Selecione um contato para enviar a mensagem.');
        }
    }

    // Enviar mensagem ao clicar no botão
    enviarMensagemButton.addEventListener('click', enviarMensagemTexto);

    // Enviar mensagem ao pressionar Enter
    mensagemInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            enviarMensagemTexto();
        }
    });

    // Gravar áudio
    gravarAudioButton.addEventListener('click', function () {
        if (!contatoAtual) {
            alert('Selecione um contato para enviar áudio.');
            return;
        }
        if (!gravando) {
            if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                    mediaRecorder = new MediaRecorder(stream);
                    mediaRecorder.start();
                    gravando = true;
                    gravarAudioButton.textContent = 'Parar Gravação';
                    audioChunks = [];

                    mediaRecorder.addEventListener('dataavailable', event => {
                        audioChunks.push(event.data);
                    });

                    mediaRecorder.addEventListener('stop', () => {
                        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                        const reader = new FileReader();
                        reader.onloadend = function() {
                            salvarMensagemAudio(reader.result);
                        };
                        reader.readAsDataURL(audioBlob);
                        gravando = false;
                        gravarAudioButton.textContent = 'Gravar Áudio';
                    });
                }).catch(err => {
                    alert('Erro ao acessar microfone: ' + err);
                });
            } else {
                alert('Gravação de áudio não suportada neste navegador.');
            }
        } else {
            mediaRecorder.stop();
        }
    });

    function salvarMensagemAudio(dataUrl) {
        const dataHora = new Date().toLocaleString();
        const mensagens = recuperarMensagens(contatoAtual);

        const novaMensagem = {
            tipo: 'audio',
            conteudo: dataUrl,
            dataHora: dataHora,
            marcada: false
        };

        mensagens.push(novaMensagem);
        salvarMensagens(contatoAtual, mensagens);
        exibirMensagens(mensagens);
    }

    // Enviar foto
    botaoFoto.addEventListener('click', () => {
        if (!contatoAtual) {
            alert('Selecione um contato para enviar foto.');
            return;
        }
        enviarFotoInput.click();
    });

    enviarFotoInput.addEventListener('change', () => {
        const file = enviarFotoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                salvarMensagemFoto(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    function salvarMensagemFoto(dataUrl) {
        const dataHora = new Date().toLocaleString();
        const mensagens = recuperarMensagens(contatoAtual);

        const novaMensagem = {
            tipo: 'foto',
            conteudo: dataUrl,
            dataHora: dataHora,
            marcada: false
        };

        mensagens.push(novaMensagem);
        salvarMensagens(contatoAtual, mensagens);
        exibirMensagens(mensagens);
    }

    // Enviar vídeo
    botaoVideo.addEventListener('click', () => {
        if (!contatoAtual) {
            alert('Selecione um contato para enviar vídeo.');
            return;
        }
        enviarVideoInput.click();
    });

    enviarVideoInput.addEventListener('change', () => {
        const file = enviarVideoInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                salvarMensagemVideo(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    });

    function salvarMensagemVideo(dataUrl) {
        const dataHora = new Date().toLocaleString();
        const mensagens = recuperarMensagens(contatoAtual);

        const novaMensagem = {
            tipo: 'video',
            conteudo: dataUrl,
            dataHora: dataHora,
            marcada: false
        };

        mensagens.push(novaMensagem);
        salvarMensagens(contatoAtual, mensagens);
        exibirMensagens(mensagens);
    }
});
