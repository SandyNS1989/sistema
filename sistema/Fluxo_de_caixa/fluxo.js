verificaAutenticado()

let Usuario = ""

const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const date = document.querySelector("#date");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expenses = document.querySelector(".expenses");
const total = document.querySelector(".total");

let items = []

btnNew.onclick = () => {
  if (descItem.value === "" || amount.value === "" || type.value === ""|| date.value === "") {
    return alert("Preencha todos os campos!");
  }
  
  const Descricao = descItem.value
  const Valor = parseInt(amount.value, 10);
  const Tipo = type.value
  const Data = date.value

  descItem.value = "";
  amount.value = "";
  date.value = "";

  fetch('/Fluxo_de_caixa', {
    method: 'POST',
    body: JSON.stringify({
      Descricao,
      Valor,
      Tipo,
      Data,
      Especialista: Usuario
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(() => {
    loadItens()
  }) 

};

document.getElementById('btnNew').addEventListener('click', function() {
  location.reload();
});

function deleteItem(index) {


  fetch('/Fluxo_de_caixa', {
    method: 'DELETE',
    body: JSON.stringify({
    id: items[index].id
    }),
    headers: {
      "Content-Type": "application/json"
    }
  }).then(() => {
    loadItens()
  })
  location.reload();
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
    <td>${item.Descricao}</td>
    <td>R$ ${item.Valor}</td>
    
    <td class="columnType">${
      item.Tipo === "Entrada"
        ? '<i class="bx bxs-chevron-up-circle"></i>'
        : '<i class="bx bxs-chevron-down-circle"></i>'
    }</td>
    <td>${item.Data}</td>
    <td class="columnAction">
      <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
    </td>
  `;

  tbody.appendChild(tr);
}

function loadItens() {
  tbody.innerHTML = "";
    items.filter(item => item.Especialista === Usuario).forEach((item, index) => {
      insertItem(item, index);
    });

    getTotals();
}

function getTotals() {
  const amountIncomes = items
    .filter((item) => item.Tipo === "Entrada" && item.Especialista === Usuario)
    .map((transaction) => Number(transaction.Valor));

  const amountExpenses = items
    .filter((item) => item.Tipo === "Saída" && item.Especialista === Usuario)
    .map((transaction) => Number(transaction.Valor));

  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expenses.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

const getItensBD = async () => {
  const response = await fetch('/Fluxo_de_caixa')
  items = await response.json()
}



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

  Usuario = data.Usuario

  const userGreeting = document.getElementById('userGreeting');
  userGreeting.textContent = `Olá, ${Usuario}!`;

  await  getItensBD()

  loadItens();
})().catch(console.error)

document.getElementById("ch-side").addEventListener("change",event=>{
  const mainSide=document.getElementById("main-side")
  if(event.target.checked){
     mainSide.classList.remove("off") 
  }
  else{
     mainSide.classList.add("off") 
  }
})

document.getElementById("btn_voltar_flx").addEventListener("click", () => {
  window.location.href = '../Menu/menu.html';
}); 