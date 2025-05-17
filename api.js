let nomeDoUsuario; // Variável para armazenar o nome do usuário

function obterNomeUsuario() {
  // Aqui você teria a lógica para pegar o nome do usuário da interface
  // Por exemplo, de um input de texto
  nomeDoUsuario = prompt("Digite seu nome:"); // Exemplo simples com prompt
  return nomeDoUsuario;
}

const suaUUID = "bd8cf928-b7f7-46f2-89d2-64efe57395be";
const participantesURL = `https://mock-api.driven.com.br/api/v6/uol/participants/${suaUUID}`;
const statusURL = `https://mock-api.driven.com.br/api/v6/uol/status/${suaUUID}`;
const mensagensURL = `https://mock-api.driven.com.br/api/v6/uol/messages/${suaUUID}`;



function entrarNaSala(nome) {
    return fetch(participantesURL, { method: 'GET' })
        .then(response => response.json())
        .then(participantes => {
            if (participantes.length >= 4) {
                throw new Error("Sala cheia! Máximo de 4 participantes.");
            }
            // Se não estiver cheia, faz o POST normalmente
            return fetch(participantesURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nome })
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao entrar na sala.");
            }
            manterConexao(nome, suaUUID);
            return response;
        });
}

function manterConexao(nomeUsuarioParaManter, uuidParaManter) {
  const urlManterConexao = `https://mock-api.driven.com.br/api/v6/uol/status/${uuidParaManter}`;
  const objetoEnviar = { name: nomeUsuarioParaManter };

  setInterval(() => {
    axios.post(urlManterConexao, objetoEnviar)
      .then(() => {
        // console.log('Usuário ainda online');
      })
      .catch((erro) => {
        console.error('Erro ao manter conexão:', erro);
      });
  },   5000);    //tempo de mantera conexão depois corrigir pra  50000
}

function buscarMensagens() {
  console.log("Buscando mensagens da API...");
    fetch(mensagensURL, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro ao buscar mensagens: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Mensagens recebidas:', data);
            limparMensagens();
            data.forEach(mensagem => {
                // Converte o campo time para Date, mas mantém as chaves originais
                mensagem.time = new Date(mensagem.time);
                exibirMensagem(mensagem);
            });
        })
        .catch(error => {
            console.error('Erro ao buscar mensagens:', error);
            alert('Erro ao buscar mensagens. Por favor, tente novamente.');
        });
}
function enviarMensagemAPI(mensagem) {
    // Lógica para enviar a mensagem para a API
    console.log("Enviando mensagem para a API:", mensagem);
  fetch(mensagensURL, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(mensagem),
})
.then(response => { // <-- Corrigido aqui!
    if (!response.ok) {
        throw new Error(`Erro ao enviar mensagem: ${response.status}`);
    }
    return response.text();
})
.then(data => {
    console.log('Mensagem enviada com sucesso:', data);
    buscarMensagens();
})
.catch(error => {
    console.error('Erro ao enviar mensagem:', error);
    alert('Erro ao enviar mensagem. Por favor, tente novamente.');
});
}


// Exemplo de como iniciar o processo de entrada na sala


setInterval(() => {
    if (typeof buscarMensagens === "function") {
        buscarMensagens();
    }
}, 3000);