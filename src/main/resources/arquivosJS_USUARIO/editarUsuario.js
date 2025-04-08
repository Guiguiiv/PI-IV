document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("id");

    if (!userId) {
        alert("ID do usuário não encontrado!");
        window.location.href = "listarUsuarios.html";
        return;
    }

    carregarDadosUsuario(userId);

    document.getElementById("formEditarUsuario").addEventListener("submit", function (event) {
        event.preventDefault();

        let nome = document.getElementById("nome").value.trim();
        let email = document.getElementById("email").value.trim();
        let grupo = document.getElementById("grupo").value;

        // Obtendo as senhas
        let novaSenha = document.getElementById("novaSenha").value.trim();
        let confirmarSenha = document.getElementById("confirmarSenha").value.trim();

        // Verificando se as senhas coincidem
        if (novaSenha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        // Se a nova senha estiver preenchida, adicione ao objeto
        const usuarioAtualizado = { nome, email, grupo };
        if (novaSenha) {
            usuarioAtualizado.senha = novaSenha;
        }

        fetch(`http://localhost:8080/usuarios/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuarioAtualizado)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao atualizar usuário");
                }
                return response.json();
            })
            .then(data => {
                alert("Usuário atualizado com sucesso!");
                window.location.href = "listarUsuario.html";
            })
            .catch(error => {
                console.error("Erro ao atualizar usuário:", error);
                alert("Erro ao atualizar o usuário.");
            });
    });
});

function carregarDadosUsuario(userId) {
    fetch(`http://localhost:8080/usuarios/id/${userId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro ao buscar usuário");
            }
            return response.json();
        })
        .then(usuario => {
            document.getElementById("id").value = usuario.id;
            document.getElementById("nome").value = usuario.nome;
            document.getElementById("cpf").value = usuario.cpf;
            document.getElementById("email").value = usuario.email;
            document.getElementById("grupo").value = usuario.grupo;
        })
        .catch(error => {
            console.error("Erro ao buscar usuário:", error);
            alert("Usuário não encontrado!");
            window.location.href = "listarUsuario.html";
        });
}
