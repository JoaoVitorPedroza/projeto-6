const conteudoDiv = document.querySelector('.conteudo');
const inputMensagem = document.querySelector('.input');
const barraPuxada = document.querySelector('.barra_puxada');
const botaoPessoas = document.getElementById('selecionar');
var data = new Date();
let modoPrivado = false;
let destinatarioPrivado = null;
let nomeUsuario = null;
let esconde = document.getElementById("esconde");
let botao = document.getElementById("selecionar"); 
let aberto = true; 
function limparMensagens() {
    
    const conteudoDiv = document.querySelector('.conteudo');
 
    Array.from(conteudoDiv.children).forEach(child => {
        if (child.tagName !== 'H1') {
            conteudoDiv.removeChild(child);
        }
    });
}
function formatarHora(data) {
    if (!(data instanceof Date) || isNaN(data.getTime())) {
        return "--:--:--";
    }
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
}


function exibirMensagem(mensagem) {
    if (conteudoDiv && mensagem.from && mensagem.text && mensagem.time && mensagem.type) {
       
        if (
            mensagem.type === "private_message" &&
            mensagem.from !== nomeUsuario &&
            mensagem.to !== nomeUsuario
        ) {
            return;
        }

        const mensagemElement = document.createElement('p');
     
        let hora = mensagem.time;
        if (typeof hora === "string") {
            hora = new Date(hora);
        }
        
        if (!(hora instanceof Date) || isNaN(hora.getTime())) {
            hora = new Date();
        }

       
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
                
                console.log("Entrou na sala com sucesso!");
             
            })
            .catch(error => {
                alert(error.message); 
                obterNomeUsuario(); 
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

function voltar_todos(){
    console.log("clickado");
}
function selecionarPrivado() {
    window.alert("Você selecionou: Privado");
    
}
function selecionarPublico() {
    window.alert("Você selecionou: Público");
    
}
function atualizarNomesUsuarios(participantes) {
   
    const ids = ['log1', 'log2', 'log3', 'log4'];
    
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