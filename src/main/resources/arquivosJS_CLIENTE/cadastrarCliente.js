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

    // Formatar CPF automaticamente para ###.###.###-##
    document.getElementById("cpf").addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 3) valor = valor.replace(/^(\d{3})(\d)/, "$1.$2");
        if (valor.length > 6) valor = valor.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
        if (valor.length > 9) valor = valor.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
        if (valor.length > 14) valor = valor.slice(0, 14); // Limita o tamanho do campo
        e.target.value = valor;
    });

    // Formatar CEP automaticamente para #####-###
    document.getElementById("cepFaturamento").addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d)/, "$1-$2");
        if (valor.length > 9) valor = valor.slice(0, 9); // Limita o tamanho do campo
        e.target.value = valor;
    });

    // Formatar data automaticamente para ##/##/####
    document.getElementById("dataNascimento").addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
        if (valor.length > 5) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
        if (valor.length > 10) valor = valor.slice(0, 10); // Limita o tamanho do campo
        e.target.value = valor;
    });


    // Verificar senha automaticamente
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

    // Buscar endereço via CEP
    document.getElementById("cepFaturamento").addEventListener("blur", async () => {
        const cep = document.getElementById("cepFaturamento").value.replace(/\D/g, '');
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
            document.getElementById("cepErro").classList.remove("d-none");
            return;
        }

        document.getElementById("cepErro").classList.add("d-none");
        document.getElementById("logradouroFaturamento").value = dados.logradouro;
        document.getElementById("bairroFaturamento").value = dados.bairro;
        document.getElementById("cidadeFaturamento").value = dados.localidade;
        document.getElementById("ufFaturamento").value = dados.uf;
    });

    // Copiar endereço para entrega
    document.getElementById("copiarEndereco").addEventListener("change", () => {
        const endereco = `
${document.getElementById("logradouroFaturamento").value}, 
Nº ${document.getElementById("numeroFaturamento").value}, 
${document.getElementById("complementoFaturamento").value}, 
${document.getElementById("bairroFaturamento").value}, 
${document.getElementById("cidadeFaturamento").value} - 
${document.getElementById("ufFaturamento").value}, 
CEP: ${document.getElementById("cepFaturamento").value}`.trim();
        document.getElementById("enderecoEntrega").value = endereco;
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
        const emailResp = await fetch(`http://localhost:8080/usuarios/email-existe?email=${email}`);
        const emailExiste = await emailResp.json();
        if (emailExiste) {
            document.getElementById("emailErro").classList.remove("d-none");
            return;
        } else {
            document.getElementById("emailErro").classList.add("d-none");
        }

        const senha = document.getElementById("senha").value;
        const confirmaSenha = document.getElementById("confirmaSenha").value;
        if (senha !== confirmaSenha) {
            document.getElementById("senhaErro").classList.remove("d-none");
            return;
        }

        const cliente = {
            nome: nome,
            cpf: cpf,
            genero: document.getElementById("genero").value,
            dataNascimento: formatarDataParaISO(document.getElementById("dataNascimento").value),
            email: email,
            senha: senha,
            grupo: "cliente",
            enderecoFaturamento: {
                cep: document.getElementById("cepFaturamento").value,
                logradouro: document.getElementById("logradouroFaturamento").value,
                numero: document.getElementById("numeroFaturamento").value,
                complemento: document.getElementById("complementoFaturamento").value,
                bairro: document.getElementById("bairroFaturamento").value,
                cidade: document.getElementById("cidadeFaturamento").value,
                uf: document.getElementById("ufFaturamento").value
            },
            enderecoEntrega: document.getElementById("enderecoEntrega").value
        };

        try {
            const resposta = await fetch("http://localhost:8080/clientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(cliente)
            });

            if (resposta.ok) {
                alert("Cadastro realizado com sucesso!");
                window.location.href = "login.html";
            } else {
                alert("Erro ao cadastrar. Verifique os dados.");
            }
        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro de conexão com o servidor.");
        }
    });
});
