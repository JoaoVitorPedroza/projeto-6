const conteudoDiv = document.querySelector('.conteudo');
const inputMensagem = document.querySelector('.input');
let nomeUsuario = null;

function formatarHora(data) {
    const horas = String(data.getHours()).padStart(2, '0');
    const minutos = String(data.getMinutes()).padStart(2, '0');
    const segundos = String(data.getSeconds()).padStart(2, '0');
    return `${horas}:${minutos}:${segundos}`;
}

function limparMensagens() {
    if (conteudoDiv) {
        const mensagens = conteudoDiv.querySelectorAll('p');
        mensagens.forEach(mensagem => {
            mensagem.remove();
        });
    } else {
        console.error("Elemento com a classe 'conteudo' não encontrado.");
    }
}

function exibirMensagem(mensagem) {
    if (conteudoDiv && mensagem.nome && mensagem.texto && mensagem.time && mensagem.tipo) {
        const mensagemElement = document.createElement('p');
        mensagemElement.textContent = `(${formatarHora(mensagem.time)}) ${mensagem.nome}: ${mensagem.texto}`;
        mensagemElement.className = mensagem.tipo;
        conteudoDiv.appendChild(mensagemElement);
        conteudoDiv.scrollTop = conteudoDiv.scrollHeight;
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
        limparMensagens();
        exibirMensagemEntrou(nomeUsuario.trim());
    } else {
        alert("Por favor, digite um nome válido.");
        obterNomeUsuario();
    }
}

function enviar_mensagem() {
    const textoMensagem = inputMensagem.value.trim();
    if (textoMensagem && nomeUsuario) {
        const mensagemParaExibir = {
            nome: nomeUsuario,
            texto: textoMensagem,
            time: new Date(),
            tipo: 'menssagem_minha' // Usando a classe para a mensagem do próprio usuário
        };
        exibirMensagem(mensagemParaExibir);
        inputMensagem.value = ''; // Limpa o campo de entrada após enviar
        console.log('Mensagem a ser exibida:', mensagemParaExibir);
    } else if (!nomeUsuario) {
        alert('Por favor, digite seu nome primeiro.');
    }
}

function sair_sala() {

    window.alert("Você saiu da sala.");
    nomeUsuario = null; // Limpa o nome do usuário
    limparMensagens(); // Limpa as mensagens da tela
    obterNomeUsuario(); // Chama a função para obter o nome novamente

}



// Chama a função para obter o nome do usuário ao carregar a página
