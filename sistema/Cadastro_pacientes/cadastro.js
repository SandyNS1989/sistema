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

  document.getElementById("btn_voltar_c").addEventListener("click", () => {
    window.location.href = '../Menu/menu.html';
});

document.getElementById("open-chat-btn1").addEventListener("click", () => {
    window.location.href = '../chat/chat.html'
 })

const list = document.getElementById("lista")

const nameinp = document.getElementById("name")
const phoneinp = document.getElementById("phone")
const emailinp = document.getElementById("email")
const nascinp = document.getElementById("nasc")
const cpf_cnpjinp = document.getElementById("cpf_cnpj")
const addressinp = document.getElementById("address")
const numberinp = document.getElementById("number")
const cepinp = document.getElementById("cep")
const cidadeinp = document.getElementById ("cidade")
const estadoinp = document.getElementById ("estado")
const isehcrianca = document.getElementById("mostrarSubforme")
const namepaiinp = document.getElementById("namepai")
const phonepaiinp = document.getElementById("phonepai")
const namemaeinp = document.getElementById("namemae")
const phonemaeinp = document.getElementById("phonemae")

function cadastrar_paciente(event) {
    event.preventDefault()
    fetch("/cadastrar_paciente", {
        method: "POST",
        body: JSON.stringify({
            Nome: nameinp.value,
            Telefone: phoneinp.value,
            Email: emailinp.value,
            Data_de_Nascimento: nascinp.value,
            CPF_CNPJ: cpf_cnpjinp.value,
            Endereco: addressinp.value,
            Numero: numberinp.value,
            CEP: cepinp.value,
            Estado: estadoinp.value,
            Cidade: cidadeinp.value,
            Eh_Crianca: isehcrianca.checked,
            Nome_do_Pai_ou_Responsavel: namepaiinp.value,
            Telefone_Pai: phonepaiinp.value,
            Nome_da_Mae_ou_Responsavel: namemaeinp.value,
            Telefone_Mae: phonemaeinp.value,
            Especialista: lista.value,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        
        alert("Paciente cadastrado com sucesso!")
        window.location.reload()
    }).catch(() => alert("Erro ao cadastrar"))
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

document.getElementById('mostrarSubforme').addEventListener('change', function () {
    var subforme = document.getElementById('subforme');
    subforme.style.display = this.checked ? 'block' : 'none';
});


const draggable = document.getElementById('draggable-container');
let isDraggable = true;
let mouseDown = false;

draggable.onmousedown = function(event) {
    if (!isDraggable) return;

    mouseDown = true;
    event.preventDefault();
    
    let shiftX = event.clientX - draggable.getBoundingClientRect().left;
    let shiftY = event.clientY - draggable.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
        draggable.style.left = pageX - shiftX + 'px';
        draggable.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(event) {
        if (mouseDown) {
            moveAt(event.pageX, event.pageY);
        }
    }

    document.addEventListener('mousemove', onMouseMove);

    draggable.onmouseup = function() {
        mouseDown = false;
        document.removeEventListener('mousemove', onMouseMove);
    };
};

draggable.ondragstart = function() {
    return false;
};

document.addEventListener('click', function(event) {
    isDraggable = !isDraggable;
    draggable.style.cursor = isDraggable ? 'move' : 'default';
});


//cep

// Função para consultar o CEP e preencher os campos de endereço
async function consultarCEP(cep) {
    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        const data = response.data;

        // Preencher os campos de endereço com os dados recebidos da API
        document.getElementById('address').value = data.logradouro;
        document.getElementById('cidade').value = data.localidade;
        document.getElementById('estado').value = data.uf;
    } catch (error) {
        console.error('Erro ao consultar CEP:', error);
        alert('CEP não encontrado. Verifique o número e tente novamente.');
    }
}

// Função para capturar o evento de mudança no campo de CEP
document.getElementById('cep').addEventListener('change', function() {
    const cep = this.value.replace(/\D/g, ''); // Remove caracteres não numéricos
    if (cep.length === 8) { // Verifica se o CEP possui 8 dígitos
        consultarCEP(cep);
    }
});

