function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;

    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf[10]);
}

function formatarDataParaISO(data) {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCadastro");

    document.getElementById("cpf").addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 3) valor = valor.replace(/^(\d{3})(\d)/, "$1.$2");
        if (valor.length > 6) valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
        if (valor.length > 9) valor = valor.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
        if (valor.length > 14) valor = valor.slice(0, 14);
        e.target.value = valor;
    });

    document.getElementById("dataNascimento").addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
        if (valor.length > 5) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
        if (valor.length > 10) valor = valor.slice(0, 10);
        e.target.value = valor;
    });

    document.getElementById("confirmaSenha").addEventListener("input", () => {
        const senha = document.getElementById("senha").value;
        const confirmaSenha = document.getElementById("confirmaSenha").value;
        const erroSenha = document.getElementById("senhaErro");

        if (senha !== confirmaSenha) {
            erroSenha.classList.remove("d-none");
        } else {
            erroSenha.classList.add("d-none");
        }
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const nomeValido = nome.split(" ").filter(p => p.length >= 3);
        if (nomeValido.length < 2) {
            alert("Informe nome completo com no mínimo 2 palavras de 3 letras.");
            return;
        }

        const cpf = document.getElementById("cpf").value.replace(/\D/g, '');
        if (!validarCPF(cpf)) {
            document.getElementById("cpfErro").classList.remove("d-none");
            return;
        } else {
            document.getElementById("cpfErro").classList.add("d-none");
        }

        const email = document.getElementById("email").value.trim();
        document.getElementById("emailErro").classList.add("d-none");

        const senha = document.getElementById("senha").value;
        const confirmaSenha = document.getElementById("confirmaSenha").value;
        if (senha !== confirmaSenha) {
            document.getElementById("senhaErro").classList.remove("d-none");
            return;
        }

        const generoSelecionado = document.getElementById("genero").value;

        const cliente = {
            nome: nome,
            cpf: cpf,
            genero: generoSelecionado, // Agora é uma string como "Masculino", "Feminino" ou outro valor
            dataNascimento: formatarDataParaISO(document.getElementById("dataNascimento").value),
            email: email,
            senha: senha
        };

        try {
            const resposta = await fetch("http://localhost:8080/cliente", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cliente)
            });

            if (resposta.ok) {
                alert("Cadastro realizado com sucesso!");
                window.location.href = "login.html";
            } else if (resposta.status === 400) {
                const erro = await resposta.json();
                if (erro.message) {
                    if (erro.message.includes("email")) {
                        document.getElementById("emailErro").classList.remove("d-none");
                    } else if (erro.message.includes("cpf")) {
                        alert("Erro: CPF inválido ou já cadastrado.");
                    } else if (erro.message.includes("data")) {
                        alert("Erro: Data de nascimento inválida.");
                    } else if (erro.message.includes("genero")) {
                        alert("Erro: Gênero informado é inválido.");
                    } else {
                        alert("Erro: " + erro.message);
                    }
                } else {
                    alert("Erro ao cadastrar. Verifique os dados informados.");
                }
            } else {
                alert("Erro ao cadastrar. Verifique os dados.");
            }
        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro de conexão com o servidor.");
        }
    });
});
