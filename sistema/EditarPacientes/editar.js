verificaAutenticado()

document.getElementById("btn_voltar_ed").addEventListener("click", () => {
    window.location.href = '../Cadastro_pacientes/lista_pacientes.html'
})

const list = document.getElementById("lista")

const nameinp = document.getElementById("name")
const phoneinp = document.getElementById("phone")
const emailinp = document.getElementById("email")
const nascinp = document.getElementById("nasc")
const cpf_cnpjinp = document.getElementById("cpf_cnpj")
const addressinp = document.getElementById("address")
const numberinp = document.getElementById("number")
const cepinp = document.getElementById("cep");
const isehcrianca = document.getElementById("mostrarSubformi")
const namepaiinp = document.getElementById("namepai")
const phonepaiinp = document.getElementById("phonepai")
const namemaeinp = document.getElementById("namemae")
const phonemaeinp = document.getElementById("phonemae")

    ;(async () => {
        const params = new URLSearchParams(window.location.search)
        const response = await fetch(`/pacientes/${params.get('id')}`)
        const data = await response.json()

        nameinp.value = data.Nome
        phoneinp.value = data.Telefone
        emailinp.value = data.Email
        nascinp.value = data.Data_de_Nascimento
        cpf_cnpjinp.value = data.CPF_CNPJ
        addressinp.value = data.Endereco
        numberinp.value = data.Numero
        cepinp.value = data.CEP
        isehcrianca.checked = data.Eh_Crianca
        namepaiinp.value = data.Nome_do_Pai_ou_Responsavel
        phonepaiinp.value = data.Telefone_Pai
        namemaeinp.value = data.Nome_da_Mae_ou_Responsavel
        phonemaeinp.value = data.Telefone_Mae         

    })();

function cadastrar_paciente(event) {
    event.preventDefault()
    const params = new URLSearchParams(window.location.search)
    fetch(`/cadastrar_paciente/${params.get('id')}`, {
        method: "PUT",
        body: JSON.stringify({
            Nome: nameinp.value,
            Telefone: phoneinp.value,
            Email: emailinp.value,
            Data_de_Nascimento: nascinp.value,
            CPF_CNPJ: cpf_cnpjinp.value,
            Endereco: addressinp.value,
            Numero: numberinp.value,
            CEP: cepinp.value,
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
        if (lista.value === "-") {
            alert("Selecione o Especialista")
            return
        }
        else{
        alert("Paciente atualizado com sucesso!")
        window.location.reload()
    }
    }).catch(() => alert("Erro ao atualizar"))
}

document.getElementById("ch-side").addEventListener("change", event => {
    const mainSide = document.getElementById("main-side")
    if (event.target.checked) {
        mainSide.classList.remove("off")
    }
    else {
        mainSide.classList.add("off")
    }
})

document.getElementById('mostrarSubformi').addEventListener('change', function () {
    var subformi = document.getElementById('subformi');
    subformi.style.display = this.checked ? 'block' : 'none';
});

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