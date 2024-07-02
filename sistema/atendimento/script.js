verificaAutenticado()

document.getElementById("ch-side").addEventListener("change",event=>{
    const mainSide=document.getElementById("main-side")
    if(event.target.checked){
       mainSide.classList.remove("off") 
    }
    else{
       mainSide.classList.add("off") 
    }
  })

  document.getElementById("btn_voltar_atd").addEventListener("click", () => {
    window.location.href = '../calendario/calendario.html';
});

// Selecionando elementos do DOM
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const stopButton = document.getElementById('stopButton');
const form = document.getElementById('form');
const formTitle = document.getElementById('formTitle');
const formContent = document.getElementById('formContent');
const nomePacienteInput = document.getElementById('nomePaciente');
const fileInput = document.getElementById('fileInput');
const historyList = document.getElementById('historyList');
const limparButton = document.getElementById('limparButton');

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);

const id_agendamento = params.get('id');
const id_paciente = params.get('id_paciente');
const nome_paciente = params.get('nome');
nomePacienteInput.value = nome_paciente;

let timerInterval;
let timerSeconds = 0;
let timerPaused = false;
let atendimentos = [];

let conteudoAtestado = ""
let conteudoAnaminese = ""
let conteudoProntuario = ""

// Função para atualizar o tempo do timer
function updateTimer() {
    if (!timerPaused) {
        timerSeconds++;
        const hours = Math.floor(timerSeconds / 3600);
        const minutes = Math.floor((timerSeconds % 3600) / 60);
        const seconds = timerSeconds % 60;
        timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// Evento de clique no botão de iniciar
startButton.addEventListener('click', () => {
    if (!timerInterval) {
        timerInterval = setInterval(updateTimer, 1000);
    }
});

// Evento de clique no botão de pausar
pauseButton.addEventListener('click', () => {
    timerPaused = !timerPaused;
});

// Evento de clique no botão de finalizar atendimento
stopButton.addEventListener('click', () => {
    clearInterval(timerInterval);
    timerInterval = null;
    const nomePaciente = nomePacienteInput.value;
    if (nomePaciente) {
        const now = new Date();
        const dataHora = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
        const tempoAtendimento = timerSeconds; // Tempo de atendimento em segundos
        
        // Criando um objeto para representar o paciente
        const paciente = {
            nome: nomePaciente,
            atendimentos: []
        };

        // Criando um objeto para representar o atendimento
        const atendimento = {
            tipo: formTitle.textContent,
            id_atendimento: "",
            id_agendamento: id_agendamento,
            id_paciente: id_paciente,
            conteudoAtestado,
            conteudoAnaminese,
            conteudoProntuario,
            dataHora: dataHora,
            tempo: tempoAtendimento,
            paciente: paciente // Referência para o paciente
        };
        
        

        fetch("/atendimento", {
            method: "POST",
            body: JSON.stringify({
                id_agendamento: atendimento.id_agendamento,
                id_paciente: atendimento.id_paciente,
                conteudoAtestado: atendimento.conteudoAtestado,
                conteudoAnaminese: atendimento.conteudoAnaminese,
                conteudoProntuario: atendimento.conteudoProntuario,
                tempo: atendimento.tempo + "",
                dataHora: atendimento.dataHora
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json()).then(data => {
            atendimento.id_atendimento = data.id;
            alert("Atendimento Registrado com sucesso!")
        }).catch(() => alert("Erro ao registrar atendimento"))

        // Adicionando o atendimento à lista de atendimentos do paciente
        paciente.atendimentos.push(atendimento);

        

        console.log(atendimento)

        // Adicionando o atendimento à lista geral de atendimentos
        atendimentos.push(atendimento);

        // const listItem = document.createElement('li');
        // listItem.textContent = `${dataHora} - ${nomePaciente}`;
        // listItem.addEventListener('click', () => openAtendimentoDetails(atendimento));
        // historyList.appendChild(listItem);
        //getAllAtendimentos();
    }
    // Limpa campos
    formTitle.textContent = '';
    nomePacienteInput.value = '';
    formContent.value = '';
    fileInput.value = '';
    timerSeconds = 0; // Zera o contador do timer
    updateTimer(); // Atualiza o timer
});

// Função para exibir os detalhes do atendimento
function openAtendimentoDetails(atendimento) {
    // console.log(atendimento)
    conteudoAnaminese = atendimento.conteudoAnaminese
    conteudoAtestado = atendimento.conteudoAtestado
    conteudoProntuario = atendimento.conteudoProntuario

    // nomePacienteInput.value = atendimento.paciente.nome; // Usamos o nome do paciente associado ao atendimento
    nomePacienteInput.value = nome_paciente; // Usamos o nome do paciente associado ao atendimento

    const tempoAtendimento = atendimento.tempo;
    const hours = Math.floor(tempoAtendimento / 3600);
    const minutes = Math.floor((tempoAtendimento % 3600) / 60);
    const seconds = tempoAtendimento % 60;
    timerElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Função para abrir o formulário correspondente
function openForm(title) {
    formTitle.textContent = title;

    if (title === "Anamnese") {
        formContent.value = conteudoAnaminese;
    }

    if (title === "Atestado") {
        formContent.value = conteudoAtestado;
    }

    if (title === "Prontuário") {
        formContent.value = conteudoProntuario;
    }
}



// Evento de limpar o formulário
// limparButton.addEventListener('click', () => {
//     formTitle.textContent = '';
//     nomePacienteInput.value = '';
//     formContent.value = '';
//     fileInput.value = '';
// });

formContent.addEventListener("change", e => {
    const title = formTitle.textContent;
    const content = e.target.value

    if (title === "Anamnese") {
        conteudoAnaminese = content;
    }

    if (title === "Atestado") {
        conteudoAtestado = content;
    }

    if (title === "Prontuário") {
         conteudoProntuario = content;
    }
})

async function getAtendimentos() {
    const response_atendimentos = await fetch(`/atendimento/${id_paciente}`)
    return response_atendimentos;
}

function getAllAtendimentos (){
getAtendimentos().then(response => response.json()).then(data => {
    for (let index = 0; index < data.paciente.length; index++) {

        const listItemUpdated = document.createElement('li');
        listItemUpdated.textContent = `${data.paciente[index].dataHora} - ${nome_paciente}`;

        // Cria o botão "Visualizar"
        const viewButton = document.createElement('button');
        viewButton.textContent = 'Visualizar';
        viewButton.classList.add('visual-button'); 
        viewButton.addEventListener('click', () => openAtendimentoDetails(data.paciente[index]));

        // Adiciona o botão ao elemento <li>
        listItemUpdated.appendChild(viewButton);

        // Adiciona o elemento <li> à lista de histórico (historyList)
        historyList.appendChild(listItemUpdated);
    }
    
})
}

let Usuario = ''

;(async () => {
    const token = localStorage.getItem(CHAVE)

    const response = await fetch('/verify', {
        body: JSON.stringify({ token }),
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        }
    })

    const data = await response.json()
    Usuario = data.Usuario;
    const userGreeting = document.getElementById('userGreeting');
    userGreeting.textContent = `Olá, ${Usuario}!`;

    // data = USUARIO DO BANCO LOGADO

// -----------------------------------

    const response2 = await fetch('/users')
    const consultores = await response2.json()


    if (data.Secretaria) {
        consultores.filter(arq=>!arq.Secretaria && arq.Nome !== "ADM").forEach(({Usuario, Nome}) => {
            list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
        })
    } else {
        [data].forEach(({Usuario, Nome}) => {
            list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
          
        })
    }
})().catch(console.error)

//getAllAtendimentos();