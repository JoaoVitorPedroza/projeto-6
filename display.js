const conteudoDiv = document.querySelector('.conteudo');
const inputMensagem = document.querySelector('.input');
const barraPuxada = document.querySelector('.barra_puxada');
const botaoPessoas = document.getElementById('selecionar');
let modoPrivado = false;
let destinatarioPrivado = null;
let nomeUsuario = null;
let esconde = document.getElementById("esconde");
let botao = document.getElementById("selecionar"); // Substitua "seuBotao" pelo ID do seu botão
let aberto = true; // Variável para rastrear se a barra está aberta ou fechada
function limparMensagens() {
    // Remove todas as mensagens (exceto o título, se quiser manter)
    const conteudoDiv = document.querySelector('.conteudo');
    // Remove todos os filhos, exceto o h1 (título)
    Array.from(conteudoDiv.children).forEach(child => {
        if (child.tagName !== 'H1') {
            conteudoDiv.removeChild(child);
        }
    });
}
function formatarHora(data) {
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
}


function exibirMensagem(mensagem) {
    if (conteudoDiv && mensagem.from && mensagem.text && mensagem.time && mensagem.type) {
        // FILTRO para mensagens privadas
        if (
            mensagem.type === "private_message" &&
            mensagem.from !== nomeUsuario &&
            mensagem.to !== nomeUsuario
        ) {
            // Não exibe a mensagem privada se não for para mim ou enviada por mim
            return;
        }

        const mensagemElement = document.createElement('p');
        // Formata o horário
        let hora = mensagem.time;
        if (typeof hora === "string") {
            hora = new Date(hora);
        }

        // Exibe o destinatário na mensagem privada
        if (mensagem.type === "private_message") {
            mensagemElement.textContent = `(${formatarHora(hora)}) ${mensagem.from} para ${mensagem.to}: ${mensagem.text}`;
            mensagemElement.className = "menssagem_privada";
        } else if (mensagem.type === "status") {
            mensagemElement.textContent = `(${formatarHora(hora)}) ${mensagem.from}: ${mensagem.text}`;
            mensagemElement.className = "menssagem_enter";
        } else if (mensagem.type === "message") {
            mensagemElement.textContent = `(${formatarHora(hora)}) ${mensagem.from}: ${mensagem.text}`;
            mensagemElement.className = mensagem.from === nomeUsuario ? "menssagem_minha" : "menssagem_alheia";
        }

        conteudoDiv.appendChild(mensagemElement);

        // Limita o número de mensagens a 20 (mantendo o título, se houver)
        const mensagens = conteudoDiv.querySelectorAll('p');
        if (mensagens.length > 20) {
            conteudoDiv.removeChild(mensagens[0]);
        }

        setTimeout(() => {
            conteudoDiv.scrollTop = conteudoDiv.scrollHeight;
        }, 50);
    } else {
        console.error("Dados da mensagem incompletos para exibição:", mensagem);
    }
}

function obterNomeUsuario() {
    nomeUsuario = window.prompt("Qual o seu nome ?");
    if (nomeUsuario && nomeUsuario.trim() !== "") {
        entrarNaSala(nomeUsuario.trim())
            .then(() => {
                limparMensagens();
                // Próximo passo: iniciar o intervalo para manter a conexão e buscar mensagens
                console.log("Entrou na sala com sucesso!");
                // Chamar manterConexao() e buscarMensagens() aqui
            })
            .catch(error => {
                alert(error.message); // Exibe a mensagem de erro para o usuário
                obterNomeUsuario(); // Pede o nome novamente
            });
    } else {
        alert("Por favor, digite um nome válido.");
        obterNomeUsuario();
    }
}


function enviar_mensagem() {
    const textoMensagem = inputMensagem.value.trim();
    if (textoMensagem && nomeUsuario) {
        let mensagemParaAPI = {
            from: nomeUsuario,
            to: "Todos",
            text: textoMensagem,
            type: "message"
        };
        if (modoPrivado && destinatarioPrivado) {
            mensagemParaAPI.to = destinatarioPrivado;
            mensagemParaAPI.type = "private_message";
        }
        enviarMensagemAPI(mensagemParaAPI);
        inputMensagem.value = '';
    }
}
function barra_lateral() {
    if (esconde.style.left === "0px" || esconde.style.left === "") {
        esconde.style.left = "-300px";
        aberto = false;
    } else {
        esconde.style.left = "0px";
        aberto = true;
    }
}

// Chama a função para obter o nome do usuário ao carregar a página
function voltar_todos(){
    console.log("clickado");
}
function selecionarPrivado() {
    window.alert("Você selecionou: Privado");
    // Aqui você pode definir uma variável para o modo privado
}
function selecionarPublico() {
    window.alert("Você selecionou: Público");
    // Aqui você pode definir uma variável para o modo público
}
function atualizarNomesUsuarios(participantes) {
    // IDs dos elementos onde os nomes serão exibidos
    const ids = ['log1', 'log2', 'log3', 'log4'];
    // Nomes padrão para quando não houver usuário
    const nomesPadrao = ['User 1', 'User 2', 'User 3', 'User 4'];

    for (let i = 0; i < ids.length; i++) {
        const el = document.getElementById(ids[i]);
        if (el) {
            if (participantes[i]) {
                el.textContent = participantes[i].name;
            } else {
                el.textContent = nomesPadrao[i];
            }
        }
    }
}

function buscarParticipantes() {
    fetch(participantesURL, { method: 'GET' })
        .then(response => response.json())
        .then(participantes => {
            atualizarNomesUsuarios(participantes);
        })
        .catch(error => {
            console.error('Erro ao buscar participantes:', error);
        });
}

// Já existe este setInterval, só garanta que buscarParticipantes está correto:
setInterval(() => {
    if (typeof buscarParticipantes === "function") {
        buscarParticipantes();
    }
}, 3000);

function selecionarPublico() {
    modoPrivado = false;
    destinatarioPrivado = null;
    alert("Modo público ativado!");
}

function selecionarPrivado() {
    modoPrivado = true;
    alert("Modo privado ativado! Agora selecione um usuário online.");
}

botao.addEventListener("click", barra_lateral);
window.onload = obterNomeUsuario;
['log1', 'log2', 'log3', 'log4'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('click', function() {
            if (modoPrivado && el.textContent && !el.textContent.startsWith('User')) {
                destinatarioPrivado = el.textContent;
                alert(`Você selecionou ${destinatarioPrivado} para mensagem privada.`);
            }
        });
    }
});