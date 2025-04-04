document.addEventListener("DOMContentLoaded", function () {
    const cpfInput = document.getElementById("cpf");
    const dataNascimentoInput = document.getElementById("dataNascimento"); // Pegando o campo de data

    // Máscara para CPF
    cpfInput.addEventListener("input", function () {
        let cpf = cpfInput.value.replace(/\D/g, "");

        if (cpf.length > 11) {
            cpf = cpf.substring(0, 11);
        }

        cpfInput.value = cpf
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    });

    // Máscara para Data de Nascimento (DD-MM-AAAA)
    dataNascimentoInput.addEventListener("input", function () {
        let valor = dataNascimentoInput.value.replace(/\D/g, ""); // Remove caracteres não numéricos

        if (valor.length > 2) {
            valor = valor.slice(0, 2) + "-" + valor.slice(2);
        }
        if (valor.length > 5) {
            valor = valor.slice(0, 5) + "-" + valor.slice(5, 9);
        }

        dataNascimentoInput.value = valor.slice(0, 10); // Limita a 10 caracteres
    });

    document.getElementById("formCadastro").addEventListener("submit", function (event) {
        event.preventDefault();

        let nome = document.getElementById("nome").value.trim();
        let cpf = cpfInput.value.replace(/\D/g, "");
        let email = document.getElementById("email").value.trim();
        let senha = document.getElementById("senha").value.trim();
        let confirmaSenha = document.getElementById("confirmaSenha").value.trim();
        let grupo = "cliente";
        let dataNascimento = dataNascimentoInput.value.trim();

        let formularioValido = true;

        // Validação do CPF
        if (!validarCPF(cpf)) {
            document.getElementById("cpfErro").classList.remove("d-none");
            formularioValido = false;
        } else {
            document.getElementById("cpfErro").classList.add("d-none");
        }

        // Validação da Senha
        if (senha !== confirmaSenha) {
            document.getElementById("senhaErro").classList.remove("d-none");
            formularioValido = false;
        } else {
            document.getElementById("senhaErro").classList.add("d-none");
        }

        // Se todas as validações passaram, envia os dados para o backend
        if (formularioValido) {
            const usuario = {
                nome,
                cpf,
                email,
                senha,
                grupo,
                data_nascimento: formatarDataParaISO(dataNascimento) // Converte para AAAA-MM-DD
            };

            fetch("http://localhost:8080/usuarios", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.id) {
                        alert("Usuário cadastrado com sucesso!");
                        document.getElementById("formCadastro").reset();
                        window.location.href = "usuarioNaoLogado.html";
                    } else {
                        alert("Erro ao cadastrar usuário!");
                    }
                })
                .catch(error => {
                    console.error("Erro na requisição:", error);
                    alert("Erro de conexão com o servidor.");
                });
        }
    });
});

// Converte DD-MM-AAAA para AAAA-MM-DD (formato SQL)
function formatarDataParaISO(data) {
    if (!data || data.length !== 10) return null;
    const partes = data.split("-");
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
}
