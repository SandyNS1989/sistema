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

document.getElementById("btn_voltar_li").addEventListener("click", () => {
  window.location.href = '../Menu/menu.html';
});

const tbody = document.querySelector("tbody");
const type = document.querySelector("#type");
let items = [];

function editarItem(index) {
  const url = new URL(window.location.href)
  url.pathname = `/sistema/EditarPacientes/editar.html`
  url.searchParams.set("id",  items.filter(item => item.Especialista === list.value)[index].id);
  window.location.href = url.toString()
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.Nome}</td>
  </td>
    <td class="columnAction">
      <button onclick="editarItem(${index})"><i class='bi bi-pencil'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItens(user) {
  tbody.innerHTML = ''

  items.filter(item => item.Especialista === user).forEach((item, index) => {
    insertItem(item, index);
  });
}


const getItensBD = async () => {
  const response = await fetch('/pacientes')
 items = await response.json()
}


getItensBD()


const list = document.getElementById("lista")

list.addEventListener('change', e => {
  loadItens(e.target.value)
})

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
          console.log(Usuario)
      })
  }
})().catch(console.error)