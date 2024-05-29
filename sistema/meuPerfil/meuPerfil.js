//verificaAutenticado()

document.getElementById("btn_voltar_mp").addEventListener("click", () => {
    window.location.href = '../Login/Login.html'
})

const list = document.getElementById("lista")

const nameinp = document.getElementById("name")
const emailinp = document.getElementById("email")
const userinp = document.getElementById("user")
const senhainp = document.getElementById("senha")
const c_senhainp = document.getElementById("c_senha")
const issecretaria = document.getElementById("secretaria")
const isprofissional = document.getElementById("profissional")


const fotinha = document.getElementById("fotinha")

    ;(async () => {
        const params = new URLSearchParams(window.location.search)
        const response = await fetch(`/users/${params.get('id')}`)
        const data = await response.json() 
    

        nameinp.value = data.Nome
        emailinp.value = data.Email
        userinp.value = data.Usuario
        senhainp.value = data.Senha
        issecretaria.checked = data.Secretaria
        isprofissional.checked = data.Profissional
        foto,


        response2 = await fetch('/users')
        
        const consultores = await response2.json()


        consultores.forEach(({Usuario, Nome}) => {
            list.innerHTML += `<option value="${Usuario}">${Nome}</option>`
        })

})();


const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});


async function cadastro_user(event) {
    event.preventDefault()
    const params = new URLSearchParams(window.location.search)
   
    let foto = null

    if (fotinha.files.length !== 0) {
        const arquivoFoto = fotinha.files[0]
        foto = await toBase64(arquivoFoto)
    }

    fetch(`/cadastro_user/${params.get('id')}`, {
        method: "PUT",
        body: JSON.stringify({

            Nome: nameinp.value,
            Email: emailinp.value,
            Usuario: userinp.value,
            Senha: senhainp.value,
            Secretaria: issecretaria.checked,
            Profissional: isprofissional.checked,
            foto,
        }),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(response => response.json()).then(data => {
        alert("Perfil atualizado com sucesso!")
        window.location.reload()
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

function displayThumbnail(event) {
    const input = event.target;
    const file = input.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const thumbnail = document.getElementById('thumbnail');
            thumbnail.src = e.target.result;
            thumbnail.style.display = 'block';
        }
        reader.readAsDataURL(file);
    }
}


