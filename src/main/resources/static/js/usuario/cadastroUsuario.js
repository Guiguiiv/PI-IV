document.addEventListener("DOMContentLoaded", function () {
    const cpfInput = document.getElementById("cpf");
    const dataNascimentoInput = document.getElementById("dataNascimento");

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
        let valor = dataNascimentoInput.value.replace(/\D/g, "");

        if (valor.length > 2) {
            valor = valor.slice(0, 2) + "-" + valor.slice(2);
        }
        if (valor.length > 5) {
            valor = valor.slice(0, 5) + "-" + valor.slice(5, 9);
        }

        dataNascimentoInput.value = valor.slice(0, 10);
    });

    document.getElementById("formCadastro").addEventListener("submit", function (event) {
        event.preventDefault();

        let nome = document.getElementById("nome").value.trim();
        let cpf = cpfInput.value.replace(/\D/g, "");
        let email = document.getElementById("email").value.trim();
        let senha = document.getElementById("senha").value.trim();
        let confirmaSenha = document.getElementById("confirmaSenha").value.trim();
        let grupo = document.getElementById("grupo").value;
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

        if (formularioValido) {
            const usuario = {
                nome,
                cpf,
                email,
                senha,
                grupo,
                data_nascimento: formatarDataParaISO(dataNascimento)
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
                        window.location.href = "/PI-IV/templates/usuario/menuAdm.html";
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

// Função para formatar data no padrão SQL
function formatarDataParaISO(data) {
    if (!data || data.length !== 10) return null;
    const partes = data.split("-");
    return `${partes[2]}-${partes[1]}-${partes[0]}`;
}

// Função de validação de CPF (simples, só pra evitar erro)
function validarCPF(cpf) {
    if (!cpf || cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let digito1 = (soma * 10) % 11;
    if (digito1 === 10 || digito1 === 11) digito1 = 0;
    if (digito1 !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    let digito2 = (soma * 10) % 11;
    if (digito2 === 10 || digito2 === 11) digito2 = 0;
    if (digito2 !== parseInt(cpf.charAt(10))) return false;

    return true;
}
