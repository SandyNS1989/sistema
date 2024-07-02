verificaAutenticado()

const modAgen = document.getElementById('mod-agen')
const modEspera = document.getElementById('mod-espera')
const modCancelado = document.getElementById('mod-cancelado')

let todosPacientes = []

const isLeapYear = (year) => {
    return (
        (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
        (year % 100 === 0 && year % 400 === 0)
    );
};
const getFebDays = (year) => {
    return isLeapYear(year) ? 29 : 28;
};
let calendar = document.querySelector('.calendar');
const month_names = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];
let month_picker = document.querySelector('#month-picker');
const dayTextFormate = document.querySelector('.day-text-formate');
const timeFormate = document.querySelector('.time-formate');
const dateFormate = document.querySelector('.date-formate');

month_picker.onclick = () => {
    month_list.classList.remove('hideonce');
    month_list.classList.remove('hide');
    month_list.classList.add('show');
    dayTextFormate.classList.remove('showtime');
    dayTextFormate.classList.add('hidetime');
    timeFormate.classList.remove('showtime');
    timeFormate.classList.add('hideTime');
    dateFormate.classList.remove('showtime');
    dateFormate.classList.add('hideTime');
};

let newCurrentDay = new Date()
let currentDayLista;

const horas = [
    6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23
]

function generateNewList() {
    document.getElementById("olcards").innerHTML = horas.reduce((acc, hora) => acc + `
    <li data-message="${String(hora).padStart(2, '0')}:00" style="--cardColor:rgb(18, 211, 195)">
      <div class="content" id="status-${String(hora).padStart(2, '0')}:00">
          <div class="text" id="agendamento-${String(hora).padStart(2, '0')}:00">
            
          </div>
      </div>
    </li>

    ${buildMinutes(hora)}
  `, '')
}

function buildMinutes(hora) {
    var minutosMontados = ''

    for (let minute = 10; minute < 60; minute += 10) {
        minutosMontados += `
        <li data-message="${String(hora).padStart(2, '0')}:${String(minute).padStart(2, '0')}" style="--cardColor:rgb(18, 211, 195)">
          <div class="content" id="status-${String(hora).padStart(2, '0')}:${String(minute).padStart(2, '0')}">
              <div class="text" id="agendamento-${String(hora).padStart(2, '0')}:${String(minute).padStart(2, '0')}">
                
              </div>
          </div>
        </li>
      `
    }
    return minutosMontados;
}



async function carregarLista(force) {
    if (newCurrentDay === currentDayLista && force === undefined) return
    currentDayLista = newCurrentDay

    generateNewList()

    const cD = (currentDayLista.getDate()).toString().padStart(2, '0')
    const cM = (currentDayLista.getMonth() + 1).toString().padStart(2, '0')
    const cY = currentDayLista.getFullYear().toString().padStart(2, '0')

    const response = await fetch('/agendamentos')
    let data = await response.json()

    data = data.filter(arg =>
        arg.Data_do_Atendimento === `${cY}-${cM}-${cD}` &&
        arg.Especialista.toLowerCase().includes(document.getElementById("lista").value.toLowerCase())
    )


    data.forEach(arg => {
        const contentId = `agendamento-${arg.Horario_da_consulta}`;

        const contentEl = document.getElementById(contentId);


        if (contentEl) {

            contentEl.innerHTML = `${todosPacientes.find(pac => arg.Nome === pac.id)?.Nome} - Especialista: ${arg.Especialista}  ${arg.observacao}`

            contentEl.style = 'cursor: pointer; user-select: none;'

            const lis = document.querySelectorAll("#olcards li");
            const startIndex = getIndexByDataMessage(`${arg.Horario_da_consulta}`);
            const endIndex = getIndexByDataMessage(`${arg.Horario_de_Termino_da_consulta}`);
           
            for (let i = startIndex; i <= endIndex && i < lis.length; i++) {
                let element = lis[i].firstElementChild;
                element.style = 'background-color: rgb(205, 205, 205);';
    
                // Adicionando mensagem de Horários Agendados apenas nos elementos cinza, exceto o horário de início
                if (i !== startIndex) {
                    const atendimentoMessage = document.createElement('div');
                    atendimentoMessage.innerText = 'Horário Ocupado';
                    atendimentoMessage.style = 'font-weight: bold; text-align: right;';
                    element.appendChild(atendimentoMessage);
                }
    
                // Adicionar borda ao elemento li
              
            }

            contentEl.onclick = () => {
                pacientesFiltrados = todosPacientes.filter(({ Especialista }) => Especialista === list.value)

                nameinp.innerHTML = ''
                pacientesFiltrados.forEach(item => {
                    nameinp.innerHTML += `<option value="${item.id}">${item.Nome}</option>`
                })

                age_name.disabled = true
                document.getElementById("btn-start-atendimento").style = "display:auto"


                modAgen.showModal()

                nameinp.value = arg.Nome
                phoneinp.value = arg.Telefone
                list.value = arg.Especialista
                data_atendimentoinp.value = arg.Data_do_Atendimento
                horario_consultainp.value = arg.Horario_da_consulta
                horariot_consultainp.value = arg.Horario_de_Termino_da_consulta
                valor_consultainpinp.value = arg.Valor_da_Consulta
                status_consultainp.value = arg.Status_da_Consulta
                status_pagamentoinp.value = arg.Status_do_pagamento
                observacaoinp.value = arg.observacao
                id_agendamento.value = arg.id

                document.getElementById("formagendamento").dataset.agendamentoId = arg.id
            }

        }

        const statusId = `status-${arg.Horario_da_consulta}`;
        const statusEl = document.getElementById(statusId);

        if (statusEl) {
            var statusFormated = arg.Status_da_Consulta.toLowerCase().replace(' ', '-')
            if (statusFormated.match("ã")) {
                statusFormated = statusFormated.replace("ã", "a");
            }
            if (statusFormated.match("ç")) {
                statusFormated = statusFormated.replace("ç", "c");
            }
            statusEl.classList.add(`status-${statusFormated}`);
        }
    })

}

function getIndexByDataMessage(dataMessage) {
    const element = document.querySelector(`[data-message="${dataMessage}"]`);
    const lis = document.querySelectorAll("#olcards li");
    return Array.prototype.indexOf.call(lis, element);
}

const generateCalendar = async (month, year) => {
    let calendar_days = document.querySelector('.calendar-days');
    calendar_days.innerHTML = '';
    let calendar_header_year = document.querySelector('#year');
    let days_of_month = [
        31,
        getFebDays(year),
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ];

    const currentDate = newCurrentDay;

    carregarLista()

    month_picker.innerHTML = month_names[month];

    calendar_header_year.innerHTML = year;

    let first_day = new Date(year, month);


    for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {

        let day = document.createElement('div');

        if (i >= first_day.getDay()) {
            const nDay = i - first_day.getDay() + 1;

            day.innerHTML = nDay

            day.onclick = (() => {
                console.log(nDay)
                const calendarCurrentDate = new Date(`${year}-${month + 1}-${nDay}`)
                newCurrentDay = calendarCurrentDate;
                generateCalendar(month, year)
            })

            if (i - first_day.getDay() + 1 === currentDate.getDate() &&
                year === currentDate.getFullYear() &&
                month === currentDate.getMonth()
            ) {
                day.classList.add('current-date');
            }
        }
        calendar_days.appendChild(day);
    }
};

let month_list = calendar.querySelector('.month-list');
month_names.forEach((e, index) => {
    let month = document.createElement('div');
    month.innerHTML = `<div>${e}</div>`;

    month_list.append(month);
    month.onclick = () => {
        currentMonth.value = index;
        generateCalendar(currentMonth.value, currentYear.value);
        month_list.classList.replace('show', 'hide');
        dayTextFormate.classList.remove('hideTime');
        dayTextFormate.classList.add('showtime');
        timeFormate.classList.remove('hideTime');
        timeFormate.classList.add('showtime');
        dateFormate.classList.remove('hideTime');
        dateFormate.classList.add('showtime');
    };
});

(function () {
    month_list.classList.add('hideonce');
})();
document.querySelector('#pre-year').onclick = () => {
    --currentYear.value;
    generateCalendar(currentMonth.value, currentYear.value);
};
document.querySelector('#next-year').onclick = () => {
    ++currentYear.value;
    generateCalendar(currentMonth.value, currentYear.value);
};

let currentDate = new Date();
let currentMonth = { value: currentDate.getMonth() };
let currentYear = { value: currentDate.getFullYear() };
generateCalendar(currentMonth.value, currentYear.value);

const todayShowTime = document.querySelector('.time-formate');
const todayShowDate = document.querySelector('.date-formate');

const currshowDate = new Date();
const showCurrentDateOption = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
};
const currentDateFormate = new Intl.DateTimeFormat(
    'pt-BR',
    showCurrentDateOption
).format(currshowDate);
todayShowDate.textContent = currentDateFormate;
setInterval(() => {
    const timer = new Date();
    const option = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    };
    const formateTimer = new Intl.DateTimeFormat('pt-br', option).format(timer);
    let time = `${`${timer.getHours()}`.padStart(
        2,
        '0'
    )}:${`${timer.getMinutes()}`.padStart(
        2,
        '0'
    )}: ${`${timer.getSeconds()}`.padStart(2, '0')}`;
    todayShowTime.textContent = formateTimer;
}, 1000);


const list = document.getElementById("lista")
const list2 = document.getElementById("esp-especialista")
let consultores = []

    ; (async () => {
        const token = localStorage.getItem(CHAVE)

        const response = await fetch('/verify', {
            body: JSON.stringify({ token }),
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()

        // data = USUARIO DO BANCO LOGADO

        // -----------------------------------

        const response2 = await fetch('/users')
        consultores = await response2.json()

        if (data.Secretaria) {
            consultores.filter(arq => !arq.Secretaria && arq.Nome !== "ADM").forEach(({ Usuario, Nome }) => {
                list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
                list2.innerHTML += `<option value="${Usuario}">${Nome}</option>`
            })
        } else {
            [data].forEach(({ Usuario, Nome }) => {
                list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
                list2.innerHTML += `<option value="${Usuario}">${Nome}</option>`
            })
        }
    })().catch(console.error)

list.onchange = async function (e) {
    await carregarLista(true)

    document.getElementById('selectedName').innerHTML = `AGENDA DR(a) - ${consultores.find(arg => arg.Usuario === list.value).Nome}`
}

const espec = document.getElementById("especialista");


const statusp = document.getElementById("status_pagamento");

const tipoDoStatus1 = "(nenhum)"
const tipoDoStatus2 = "Pago"
const tipoDoStatus3 = "Pendente"

statusp.innerHTML += `<option>${tipoDoStatus1}</option>`;
statusp.innerHTML += `<option>${tipoDoStatus2}</option>`;
statusp.innerHTML += `<option>${tipoDoStatus3}</option>`;

const statusc = document.getElementById("status_c");

const tipoDoStatusc1 = "(nenhum)"
const tipoDoStatusc2 = "Confirmado"
const tipoDoStatusc3 = "Aguardando Confirmação"
const tipoDoStatusc4 = "Cancelado"

statusc.innerHTML += `<option>${tipoDoStatusc1}</option>`;
statusc.innerHTML += `<option>${tipoDoStatusc2}</option>`;
statusc.innerHTML += `<option>${tipoDoStatusc3}</option>`;
statusc.innerHTML += `<option>${tipoDoStatusc4}</option>`;

; (async () => {
    const response = await fetch('/pacientes')
    todosPacientes = await response.json()
})()

let pacientesFiltrados = []


document.getElementById('agendamento').addEventListener('click', () => {
    if (list.value === "-") {
        alert("Selecione o Especialista")
        return
    }

    pacientesFiltrados = todosPacientes.filter(({ Especialista }) => Especialista === list.value)
    age_name.disabled = false
    document.getElementById("btn-start-atendimento").style = "display:none"

    nameinp.innerHTML = ''
    pacientesFiltrados.forEach(item => {
        nameinp.innerHTML += `<option value="${item.id}">${item.Nome}</option>`
    })

    document.getElementById("formagendamento").dataset.agendamentoId = "0";
    nameinp.value = "" // A escrita antes do : tem que ta igual ao campo que foi criado no prisma
    phoneinp.value = ""
    data_atendimentoinp.value = ""
    horario_consultainp.value = ""
    horariot_consultainp.value = ""
    valor_consultainpinp.value = ""
    status_consultainp.value = ""
    status_pagamentoinp.value = ""
    observacaoinp.value = ""
    id_agendamento.value = ""
    modAgen.showModal()
});

document.getElementById('btn-close').addEventListener('click', () => {

    modAgen.close()
})

document.getElementById("btn_voltar_a").addEventListener("click", () => {
    window.location.href = '../Menu/menu.html'
})


const nameinp = document.getElementById("age_name") //O getElementById tem que ser igual o id
const phoneinp = document.getElementById("phone")
const data_atendimentoinp = document.getElementById("data_atendimento")
const horario_consultainp = document.getElementById("horario_consulta")
const horariot_consultainp = document.getElementById("horariot_consulta")
const valor_consultainpinp = document.getElementById("valor_consulta")
const status_consultainp = document.getElementById("status_c")
const status_pagamentoinp = document.getElementById("status_pagamento")
const observacaoinp = document.getElementById("observacao")
const id_agendamento = document.getElementById("id_agendamento")

function atualizaTelefone() {
    const paciente = pacientesFiltrados.find(paciente => paciente.id === nameinp.value)
    phoneinp.value = paciente.Telefone
}


function calculadata() {

    var repeticoes = parseInt(document.getElementById("repeticoes").value);
    var tipo = document.getElementById("periodo").value;
    var periodo = 0;
    var dataBrasileira = document.getElementById("data_atendimento").value;


    switch (tipo) {
        case "semanal":
            periodo = 7;
            break;
        case "quinzenal":
            periodo = 15;
            break;
        case "mensal":
            periodo = 30;
            break;
        case "anual":
            periodo = 365;
            break;
        default:
            periodo = 0;
            break;
    }
    var texto = "";
    var arrayData = [];

    for (var i = 1; i <= repeticoes; i++) {
        var data = new Date(dataBrasileira);
        data.setDate(data.getDate() + i * periodo)
        arrayData.push(data);
    }
    return arrayData;
}

document.getElementById('mostrarSubform').addEventListener('change', function () {
    var subform = document.getElementById('subform');
    subform.style.display = this.checked ? 'block' : 'none';
});

function converterDataFormatoBrasileiroParaISO(data) {
    var partes = data.split("/");
    return partes[2] + "-" + partes[1] + "-" + partes[0];
}

function agendamento(event) {
    event.preventDefault();

    const form = document.getElementById("formagendamento");
    const { agendamentoId } = form.dataset;

    const inputs = {
        nome: nameinp.value,
        telefone: phoneinp.value,
        especialista: list.value,
        dataAtendimento: data_atendimentoinp.value,
        horarioConsulta: horario_consultainp.value,
        horarioTerminoConsulta: horariot_consultainp.value,
        valorConsulta: Number(valor_consultainpinp.value),
        statusConsulta: status_consultainp.value,
        statusPagamento: status_pagamentoinp.value,
        observacao: observacaoinp.value
    };

    const clearInputs = () => {
        nameinp.value = "";
        phoneinp.value = "";
        data_atendimentoinp.value = "";
        horario_consultainp.value = "";
        horariot_consultainp.value = "";
        valor_consultainpinp.value = "";
        status_consultainp.value = "";
        status_pagamentoinp.value = "";
        observacaoinp.value = "";
    };

    const createAppointment = (data) => {
        fetch("/agendamento", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            alert("Paciente Agendado com sucesso!");
            clearInputs();
            carregarLista(true).catch(console.error);
        })
        .catch(() => alert("Erro ao Agendar"));
    };

    const updateAppointment = (data) => {
        fetch("/agendamento", {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.json())
        .then(data => {
            alert("Paciente Atualizado com sucesso!");
            carregarLista(true).catch(console.error);
        })
        .catch(() => alert("Erro ao atualizar"));
    };

    const checkForConflicts = (data, callback, agendamentoId = null) => {
        fetch(`/agendamentos?data=${data.Data_do_Atendimento}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar agendamentos.');
                }
                return response.json();
            })
            .then(existingAppointments => {
                const conflict = existingAppointments.some(appt => {
                    // Ignora o próprio agendamento ao verificar conflitos
                    if (agendamentoId && appt.id === agendamentoId) {
                        return false;
                    }
                    // Verifica se a data é a mesma
                    if (appt.Data_do_Atendimento !== data.Data_do_Atendimento) {
                        return false;
                    }
                    // Verifica se há sobreposição considerando todos os casos possíveis
                    return !(appt.Horario_de_Termino_da_consulta <= data.Horario_da_consulta || 
                             appt.Horario_da_consulta >= data.Horario_de_Termino_da_consulta);
                });

                if (conflict) {
                    alert("Horário já está ocupado. Escolha outro horário.");
                } else {
                    callback(data); // Chama a função callback para agendar
                }

                console.log(conflict)   
            })
            .catch(error => {
                console.error('Erro ao verificar conflitos:', error);
                // Trate o erro de forma apropriada, como exibir uma mensagem ao usuário
                alert('Ocorreu um erro ao verificar conflitos. Tente novamente mais tarde.');
            });
    };

    const appointmentData = {
        Nome: inputs.nome,
        Telefone: inputs.telefone,
        Especialista: inputs.especialista,
        Data_do_Atendimento: inputs.dataAtendimento,
        Horario_da_consulta: inputs.horarioConsulta,
        Horario_de_Termino_da_consulta: inputs.horarioTerminoConsulta,
        Valor_da_Consulta: inputs.valorConsulta,
        Status_da_Consulta: inputs.statusConsulta,
        Status_do_pagamento: inputs.statusPagamento,
        observacao: inputs.observacao
    };

    if (agendamentoId === '0') {
        const datasFuturasProgramadas = calculadata();

        if (datasFuturasProgramadas.length > 0) {
            datasFuturasProgramadas.forEach(data => {
                const futureAppointmentData = {
                    ...appointmentData,
                    Data_do_Atendimento: data.toISOString().split('T')[0]
                };
                checkForConflicts(futureAppointmentData, createAppointment);
            });
        }

        checkForConflicts(appointmentData, createAppointment);
    } else {
        const updatedData = { id: agendamentoId, ...appointmentData };
        checkForConflicts(updatedData, updateAppointment, agendamentoId);
    }



    //ESPERA
    function cadastro_espera(event) {
        event.preventDefault()
        fetch("/cadastro_paciente", {
            method: "POST",
            body: JSON.stringify({
                Nome: nameinp.value,
                Telefone: phoneinp.value,
                Convenio: convenioinp.value,
                Observacao: observacaoinp.value,
                // Especialista: list.value,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json()).then(data => {
            alert("Paciente adicionado a lista de espera com sucesso!")
            window.location.reload()
        }).catch(() => alert("Erro ao adicionar"))
    }
}
function AbrirEspera() {
    if (list.value === "-") {
        alert("Selecione o Especialista")
        return
    }
    const selectElement = document.getElementById('lista');
    const valorSelecionado = selectElement.value;
    // modEspera.showModal()
    loadItens(valorSelecionado)
    if (typeof modEspera.showModal === "function") {
        modEspera.showModal(); // Abre o modal
    } else {
        // Fallback para navegadores que não suportam showModal
        modEspera.style.display = "block";
    }
}
function espera(event) {
    event.preventDefault()
    const nameinp = document.getElementById("esp-name")
    const phoneinp = document.getElementById("phone")
    const convenioinp = document.getElementById("esp-convenio")
    const observacaoinp = document.getElementById("esp-observacao")
    const id_agendamento = document.getElementById("id_agendamento")

    fetch('/Lista_espera', {
        method: 'POST',
        body: JSON.stringify({
            Nome: nameinp.value,
            Telefone: phoneinp.value,
            Convenio: convenioinp.value,
            Observacao: observacaoinp.value,
            Especialista: list.value,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(() => {
        loadItens()
    })
}
// loadintens espera
const getItensBD = async (Especialista) => {
    const response = await fetch(`/Lista_espera/${Especialista}`)
    items = await response.json()
}
function insertItem(item, index) {
    let tr = document.createElement("tr");
    tr.innerHTML = `
<td>${item.Nome}</td>
<td>${item.Telefone}</td>
<td>${item.Convenio}</td>
<td>${item.Especialista}</td>
<td>${item.Observacao}</td>



<td class="columnAction">
    <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
</td>
`;
    tbody.appendChild(tr);
}
const tbody = document.querySelector("tbody");
function loadItens(Especialista) {
    getItensBD(Especialista).then(() => {
        tbody.innerHTML = "";
        items.forEach((item, index) => {
            insertItem(item, index);
        });
    }).catch(console.error)
}
document.getElementById('btn-close-espera').addEventListener('click', () => {
    modEspera.close()
})



// CANCELADO

const tbodyCancelado = document.getElementById("tbodyCancelado");

const getConsultasBD = async (valuePacienteFiltrado) => {

    const response = await fetch("/agendamentos_filtrado?id=" + valuePacienteFiltrado, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    itemsCancelado = await response.json()
    itemsCancelado.map(arg => {
        arg.Nome = todosPacientes.find(({ id }) => id === arg.Nome).Nome
        return arg
    })
}

function loadConsultas(event) {

    event.preventDefault()
    let pacienteFiltrado = document.getElementById("age_name_cancelado");
    let valuePacienteFiltrado = pacienteFiltrado.value;
    getConsultasBD(valuePacienteFiltrado).then(() => {
        tbodyCancelado.innerHTML = "";
        itemsCancelado.forEach((item, index) => {
            insertItemCancelado(item, index);
        });

    }).catch(console.error)
}



function insertItemCancelado(item, index) {

    let tr = document.createElement("tr");
    const moment = new Date(item.Data_do_Atendimento)
    const dia = moment.getDate() + 1
    const mes = moment.getMonth() + 1
    const ano = moment.getFullYear()

    tr.innerHTML = `
      <td><input type="checkbox"></td>
      <td id="${item.id}">${item.Nome}</td>
      <td>${dia}/${mes}/${ano}</td>
      <td>${item.Horario_da_consulta}</td>
      <td>${item.Horario_de_Termino_da_consulta}</td>
      <td>${item.Status_da_Consulta}</td>
      <td>${item.Status_do_pagamento}</td>
    `;

    tbodyCancelado.appendChild(tr);
}



function deleteItemInDB(event, index) {
    fetch("/agendamento_desabilitado", {
        method: "PUT",
        body: JSON.stringify({
            id: index,
            Status_da_Consulta: "Cancelado",
        }),
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => response.json()).then(data => {
        loadConsultas(event)
    })
}


function deleteSelectedRows(event) {

    event.preventDefault()

    var table = document.getElementById("tableCancelados");
    var checkboxes = table.querySelectorAll("input[type='checkbox']:checked");

    checkboxes.forEach(function (checkbox) {
        var row = checkbox.parentNode.parentNode;

        var parentTd = checkbox.parentElement;
        var nextTd = parentTd.nextElementSibling;
        var idDoElemento = nextTd.getAttribute('id');
        //   row.parentNode.removeChild(row);

        deleteItemInDB(event, idDoElemento);
    });
}

var elementos = document.getElementsByClassName('trashCancelado');

// Itera sobre a lista de elementos
for (var i = 0; i < elementos.length; i++) {
    // Adiciona um ouvinte de evento de clique a cada elemento
    elementos[i].addEventListener('click', function (event) {
        // Impede o comportamento padrão do evento (neste caso, o clique)
        event.preventDefault();

        // Insira aqui o que você deseja fazer quando um elemento com a classe 'trashCancelado' for clicado
    });
}


document.getElementById('btn-close-cancelado').addEventListener('click', () => {
    modCancelado.close()
})

function AbrirCancelado() {
    if (list.value === "-") {
        alert("Selecione o Especialista")
        return
    }
    // modEspera.showModal()
    if (typeof modCancelado.showModal === "function") {
        modCancelado.showModal(); // Abre o modal
    } else {
        // Fallback para navegadores que não suportam showModal
        modCancelado.style.display = "block";
    }
}

let pacientesFiltradosCancelado = []
const nameinpcancelado = document.getElementById("age_name_cancelado")


document.getElementById('cancelado').addEventListener('click', () => {
    if (list.value === "-") {
        return
    }

    pacientesFiltradosCancelado = todosPacientes.filter(({ Especialista }) => Especialista === list.value)

    nameinpcancelado.innerHTML = ''
    pacientesFiltradosCancelado.forEach(item => {
        nameinpcancelado.innerHTML += `<option value="${item.id}">${item.Nome}</option>`
    })

    modCancelado.showModal()
});

function atendimento(id, nome) {
    const nomePaciente = age_name.options[age_name.selectedIndex].text;
    const url = new URL(window.location.href)
    url.pathname = "/sistema/atendimento/atendimento.html";
    url.searchParams.set("id", id);
    url.searchParams.set("id_paciente", nameinp.value);
    url.searchParams.set("nome", nomePaciente);
    window.location.href = url.toString()
}

