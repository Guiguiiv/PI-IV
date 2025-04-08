document.addEventListener("DOMContentLoaded", function () {
    carregarUsuarios(); // Garante que os usuários sejam carregados ao abrir a página
});

function carregarUsuarios() {
    fetch("http://localhost:8080/usuarios")
        .then(response => response.json())
        .then(usuarios => preencherTabela(usuarios))
        .catch(error => console.error("Erro ao buscar usuários:", error));
}

function buscarUsuario() {
    let termo = document.getElementById("searchInput").value.trim();

    if (termo === "") {
        alert("Digite um ID, email ou CPF para buscar!");
        return;
    }

    // Verifica se o termo digitado é um email válido
    if (termo.includes("@")) {
        buscarUsuarioPorEmail(termo);
    }
    // Verifica se o termo digitado é um CPF (número com 11 dígitos)
    else if (termo.length === 11 && !isNaN(termo)) {
        buscarUsuarioPorCpf(termo);
    }
    // Caso contrário, tenta buscar por ID (número)
    else if (!isNaN(termo)) {
        buscarUsuarioPorId(termo);
    } else {
        alert("Formato de busca inválido!");
    }
}

function buscarUsuarioPorId(id) {
    fetch(`http://localhost:8080/usuarios/id/${id}`)
        .then(response => response.json())
        .then(usuario => preencherTabela([usuario])) // Converte para array para exibir na tabela
        .catch(error => {
            console.error("Erro ao buscar usuário por ID:", error);
            alert("Usuário não encontrado!");
        });
}

function buscarUsuarioPorEmail(email) {
    fetch(`http://localhost:8080/usuarios/email/${email}`)
        .then(response => response.json())
        .then(usuario => preencherTabela([usuario]))
        .catch(error => {
            console.error("Erro ao buscar usuário por email:", error);
            alert("Usuário não encontrado!");
        });
}

function buscarUsuarioPorCpf(cpf) {
    fetch(`http://localhost:8080/usuarios/cpf/${cpf}`)
        .then(response => response.json())
        .then(usuario => preencherTabela([usuario]))
        .catch(error => {
            console.error("Erro ao buscar usuário por CPF:", error);
            alert("Usuário não encontrado!");
        });
}

function preencherTabela(usuarios) {
    let tabela = document.getElementById("tabelaUsuarios");
    tabela.innerHTML = ""; // Limpa a tabela antes de preencher

    if (usuarios.length === 0) {
        tabela.innerHTML = `<tr><td colspan="6">Nenhum usuário encontrado.</td></tr>`;
        return;
    }

    usuarios.forEach(usuario => {
        let status = usuario.ativo ? "Ativo" : "Desativado";
        let linha = `
            <tr>
                <td>${usuario.id}</td>
                <td>${usuario.nome}</td>
                <td>${usuario.email}</td>
                <td>${status}</td>
                <td>${usuario.grupo}</td>
                <td>
                    <button class="btn btn-warning" onclick="alterarUsuario(${usuario.id})">Alterar</button>
                    <button class="btn btn-secondary" onclick="ativarDesativarUsuario(${usuario.id}, ${usuario.ativo})">${usuario.ativo ? 'Desativar' : 'Ativar'}</button>
                </td>
            </tr>
        `;
        tabela.innerHTML += linha;
    });
}

function alterarUsuario(id) {
    // Redireciona para a página de edição de usuário
    window.location.href = `editarUsuario.html?id=${id}`;
}

function ativarDesativarUsuario(id, ativo) {
    // Faz uma requisição para ativar ou desativar o usuário
    const usuarioAtivo = !ativo;
    fetch(`http://localhost:8080/usuarios/ativarDesativar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ativo: usuarioAtivo })
    })
        .then(response => response.json())
        .then(() => {
            alert(`Usuário ${usuarioAtivo ? 'ativado' : 'desativado'} com sucesso!`);
            carregarUsuarios(); // Atualiza a lista de usuários
        })
        .catch(error => console.error("Erro ao alterar status do usuário:", error));
}
