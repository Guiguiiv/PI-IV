document.addEventListener("DOMContentLoaded", function () {
    const cpfInput = document.getElementById("cpf");
    const dataNascimentoInput = document.getElementById("dataNascimento");

    // Máscara para CPF
    cpfInput.addEventListener("input", function () {
        let cpf = cpfInput.value.replace(/\D/g, "");
        if (cpf.length > 11) cpf = cpf.substring(0, 11);

        cpfInput.value = cpf
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
    });

    // Máscara para Data de Nascimento (DD-MM-AAAA)
    dataNascimentoInput.addEventListener("input", function () {
        let valor = dataNascimentoInput.value.replace(/\D/g, "");
        if (valor.length > 2) valor = valor.slice(0, 2) + "-" + valor.slice(2);
        if (valor.length > 5) valor = valor.slice(0, 5) + "-" + valor.slice(5, 9);
        dataNascimentoInput.value = valor.slice(0, 10);
    });

    // Lida com o envio do formulário
    document.getElementById("formCadastro").addEventListener("submit", function (event) {
        event.preventDefault();

        let nome = document.getElementById("nome").value.trim();
        let cpf = cpfInput.value.replace(/\D/g, "");
        let genero = document.getElementById("genero").value.trim();
        let email = document.getElementById("email").value.trim();
        let senha = document.getElementById("senha").value.trim();
        let confirmaSenha = document.getElementById("confirmaSenha").value.trim();
        let dataNascimento = dataNascimentoInput.value.trim();
        let grupo = "cliente";

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

        // Validação do nome (mínimo 2 palavras, cada uma com 3 letras ou mais)
        const nomeValido = nome.split(" ").filter(p => p.length >= 3);
        if (nomeValido.length < 2) {
            alert("Por favor, informe seu nome completo com pelo menos duas palavras de no mínimo 3 letras.");
            formularioValido = false;
        }

        // Se tudo estiver válido, envia os dados
        if (formularioValido) {
            const usuario = {
                nome,
                cpf,
                genero,
                email,
                senha,
                grupo,
                dataNascimento: formatarDataParaISO(dataNascimento)
            };

            fetch("http://localhost:3306/usuarios", {
                method: "POST",
                mode: "cors",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(usuario)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erro na resposta do servidor");
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.id) {
                        alert("Usuário cadastrado com sucesso!");
                        document.getElementById("formCadastro").reset();
                        window.location.href = "cadastrarEndCliente.html";
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

// Converte DD-MM-AAAA para AAAA-MM-DD (formato ISO/Spring Boot)
function formatarDataParaISO(data) {
    if (!data || data.length !== 10) return null;
    const partes = data.split("-");
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
}
