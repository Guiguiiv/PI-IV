function validarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0, resto;

    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;

    return resto === parseInt(cpf.charAt(10));
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCadastro");

    // Máscara do CPF
    document.getElementById("cpf").addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 3) valor = valor.replace(/^(\d{3})(\d)/, "$1.$2");
        if (valor.length > 6) valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
        if (valor.length > 9) valor = valor.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
        if (valor.length > 14) valor = valor.slice(0, 14);
        e.target.value = valor;
    });

    // Máscara para data de nascimento (dd/mm/aaaa)
    document.getElementById("dataNascimento").addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
        if (valor.length > 5) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
        if (valor.length > 10) valor = valor.slice(0, 10);
        e.target.value = valor;
    });


    // Confirmação de senha
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
        const senha = document.getElementById("senha").value;
        const confirmaSenha = document.getElementById("confirmaSenha").value;

        if (senha !== confirmaSenha) {
            document.getElementById("senhaErro").classList.remove("d-none");
            return;
        }

        const generoSelecionado = document.getElementById("genero").value;
        let dataNascimento = document.getElementById("dataNascimento").value;

        // Converter data para o formato yyyy-MM-dd
        const partes = dataNascimento.split('/');
        if (partes.length !== 3) {
            alert("Formato de data inválido. Use dd/mm/aaaa.");
            return;
        }
        dataNascimento = `${partes[2]}-${partes[1]}-${partes[0]}`;

        const cliente = {
            nome: nome,
            cpf: cpf,
            genero: generoSelecionado,
            dataNascimento: dataNascimento,
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
                alert("Erro: " + (erro.message || "Verifique os dados informados."));
            } else {
                alert("Erro ao cadastrar. Tente novamente.");
            }
        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro de conexão com o servidor.");
        }
    });
});
