const conteudoDiv = document.querySelector('.conteudo');
const inputMensagem = document.querySelector('.input');
const barraPuxada = document.querySelector('.barra_puxada');
const botaoPessoas = document.getElementById('selecionar');
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
        const mensagemElement = document.createElement('p');
        // Formata o horário
        let hora = mensagem.time;
        if (typeof hora === "string") {
            hora = new Date(hora);
        }
        mensagemElement.textContent = `(${formatarHora(hora)}) ${mensagem.from}: ${mensagem.text}`;
        // Define a classe conforme o tipo
        if (mensagem.type === "status") {
            mensagemElement.className = "menssagem_enter";
        } else if (mensagem.type === "private_message") {
            mensagemElement.className = "menssagem_privada";
        } else if (mensagem.type === "message") {
            mensagemElement.className = mensagem.from === nomeUsuario ? "menssagem_minha" : "menssagem_alheia";
        }
        conteudoDiv.appendChild(mensagemElement);
         setTimeout(() => {
            conteudoDiv.scrollTop = conteudoDiv.scrollHeight;
        }, 50);
    } else {
        console.error("Dados da mensagem incompletos para exibição:", mensagem);
    }
}

function exibirMensagemEntrou(usuario) {
    if (conteudoDiv && usuario) {
        const mensagemElement = document.createElement('p');
        mensagemElement.id = 'enter';
        mensagemElement.className = 'menssagem_enter';
        const agora = new Date();
        const horaFormatada = formatarHora(agora);
        mensagemElement.textContent = `(${horaFormatada})${usuario}: entrou na sala`;
        conteudoDiv.appendChild(mensagemElement);
        conteudoDiv.scrollTop = conteudoDiv.scrollHeight;
    } else {
        console.error("Elemento com a classe 'conteudo' não encontrado ou nome de usuário não fornecido.");
    }
}

function obterNomeUsuario() {
    nomeUsuario = window.prompt("Qual o seu nome ?");
    if (nomeUsuario && nomeUsuario.trim() !== "") {
        entrarNaSala(nomeUsuario.trim())
            .then(() => {
                limparMensagens();
                exibirMensagemEntrou(nomeUsuario.trim());
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
        const mensagemParaAPI = {
            from: nomeUsuario,
            to: "Todos",
            text: textoMensagem,
            type: "message"
        };
        enviarMensagemAPI(mensagemParaAPI); // Envia para a API
        inputMensagem.value = '';
    }
}
function barra_lateral() {
    if (aberto) {
        esconde.style.left = "-300px";
        aberto = false;
    } else {
        esconde.style.left = "0px"; // Ou "100px" se essa for a posição inicial visível
        aberto = true;
    }
}
botao.addEventListener("click", barra_lateral);
window.onload = obterNomeUsuario;
// Chama a função para obter o nome do usuário ao carregar a página
