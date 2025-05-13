obterNomeUsuario();
const suaUUID = "9fa25bfe-f737-474a-9074-89378d251fe0"; 
const participantesURL = `https://mock-api.driven.com.br/api/v6/uol/participants/${suaUUID}`;

function buscarParticipantes() {
    fetch(participantesURL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Erro na requisição: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log("Lista de participantes:", data);
            // Aqui você pode processar a lista de participantes e exibi-la na tela
        })
        .catch(error => {
            console.error("Erro ao buscar participantes:", error);
        });
}

// Chame a função para buscar os participantes
buscarParticipantes();