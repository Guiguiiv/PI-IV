document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCadastro");

    const validarCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, '');
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

        let soma = 0, resto;
        for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;
        if (resto !== parseInt(cpf.charAt(9))) return false;

        soma = 0;
        for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
        resto = (soma * 10) % 11;
        if (resto === 10 || resto === 11) resto = 0;

        return resto === parseInt(cpf.charAt(10));
    };

    const senhaInput = document.getElementById("senha");
    const confirmaSenhaInput = document.getElementById("confirmaSenha");
    const erroSenha = document.getElementById("erroSenha");

    function verificarSenhas() {
        const senha = senhaInput.value;
        const confirmaSenha = confirmaSenhaInput.value;
        erroSenha.style.display = (senha && confirmaSenha && senha !== confirmaSenha) ? "inline" : "none";
    }

    senhaInput.addEventListener("input", verificarSenhas);
    confirmaSenhaInput.addEventListener("input", verificarSenhas);

    document.getElementById("cpf").addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, '');
        v = v.replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4")
            .slice(0, 14);
        e.target.value = v;
    });

    //MASCARA PARA CEP
    const aplicarMascaraCEP = (campoId) => {
        document.getElementById(campoId).addEventListener("input", (e) => {
            let v = e.target.value.replace(/\D/g, '');
            v = v.replace(/^(\d{5})(\d)/, "$1-$2").slice(0, 9);
            e.target.value = v;
        });
    };

    const dataNascimentoInput = document.getElementById("dataNascimento");

    dataNascimentoInput.addEventListener("input", (e) => {
        let v = e.target.value.replace(/\D/g, '');

        // Garante no máximo 8 dígitos (DDMMYYYY)
        v = v.slice(0, 8);

        let novaData = '';
        if (v.length >= 1) novaData = v.slice(0, 2);        // Dia
        if (v.length >= 3) novaData += '/' + v.slice(2, 4); // Mês
        if (v.length >= 5) novaData += '/' + v.slice(4, 8); // Ano (máximo 4 dígitos)

        e.target.value = novaData;
    });


    aplicarMascaraCEP("cepFaturamento");
    aplicarMascaraCEP("cepEntrega");


    document.getElementById("cepFaturamento").addEventListener("blur", async (e) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length !== 8) return;

        try {
            const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await res.json();
            if (data.erro) {
                alert("CEP inválido!");
                return;
            }

            document.getElementById("logradouroFaturamento").value = data.logradouro || '';
            document.getElementById("bairroFaturamento").value = data.bairro || '';
            document.getElementById("cidadeFaturamento").value = data.localidade || '';
            document.getElementById("ufFaturamento").value = data.uf || '';
        } catch {
            alert("Erro ao buscar o CEP");
        }
    });

    document.getElementById("copiarEndereco").addEventListener("change", (e) => {
        if (e.target.checked) {
            document.getElementById("cepEntrega").value = document.getElementById("cepFaturamento").value;
            document.getElementById("logradouroEntrega").value = document.getElementById("logradouroFaturamento").value;
            document.getElementById("numeroEntrega").value = document.getElementById("numeroFaturamento").value;
            document.getElementById("complementoEntrega").value = document.getElementById("complementoFaturamento").value;
            document.getElementById("bairroEntrega").value = document.getElementById("bairroFaturamento").value;
            document.getElementById("cidadeEntrega").value = document.getElementById("cidadeFaturamento").value;
            document.getElementById("ufEntrega").value = document.getElementById("ufFaturamento").value;
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
            alert("CPF inválido!");
            return;
        }

        const cpfExistente = await fetch(`http://localhost:8080/cliente/cpf/${cpf}`);
        if (cpfExistente.status === 200) {
            alert("CPF já cadastrado.");
            return;
        }

        const email = document.getElementById("email").value.trim();
        const emailExistente = await fetch(`http://localhost:8080/cliente/email/${email}`);
        if (emailExistente.status === 200) {
            alert("E-mail já cadastrado.");
            return;
        }

        const genero = document.getElementById("genero").value;
        let dataNascimento = document.getElementById("dataNascimento").value;
        const senha = document.getElementById("senha").value;
        const confirmaSenha = document.getElementById("confirmaSenha").value;

        if (senha !== confirmaSenha) {
            erroSenha.style.display = "inline";
            return;
        }

        // Converte data ddMMyyyy para yyyy-MM-dd sem formatação
        const dataSemFormatacao = dataNascimento.replace(/\D/g, '');
        const partes = dataSemFormatacao.match(/^(\d{2})(\d{2})(\d{4})$/);
        if (!partes) {
            alert("Data de nascimento inválida. Use o formato DD/MM/AAAA.");
            return;
        }
        const [_, dia, mes, ano] = partes;
        const dataFormatada = `${ano}-${mes}-${dia}`;


        const cliente = {
            nome,
            cpf,
            email,
            senha,
            genero,
            dataNascimento: dataFormatada,
            enderecos: [
                {
                    cep: document.getElementById("cepFaturamento").value,
                    logradouro: document.getElementById("logradouroFaturamento").value,
                    numero: document.getElementById("numeroFaturamento").value,
                    complemento: document.getElementById("complementoFaturamento").value,
                    bairro: document.getElementById("bairroFaturamento").value,
                    cidade: document.getElementById("cidadeFaturamento").value,
                    uf: document.getElementById("ufFaturamento").value,
                    principal: true
                },
                {
                    cep: document.getElementById("cepEntrega").value,
                    logradouro: document.getElementById("logradouroEntrega").value,
                    numero: document.getElementById("numeroEntrega").value,
                    complemento: document.getElementById("complementoEntrega").value,
                    bairro: document.getElementById("bairroEntrega").value,
                    cidade: document.getElementById("cidadeEntrega").value,
                    uf: document.getElementById("ufEntrega").value,
                    principal: false
                }
            ]
        };

        try {
            const response = await fetch("http://localhost:8080/cliente", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cliente)
            });

            if (response.ok) {
                alert("Cadastro realizado com sucesso!");
                window.location.href = "loginCliente.html"; // ou outro redirecionamento
            } else {
                const erro = await response.text();
                alert("Erro ao cadastrar: " + erro);
            }
        } catch (error) {
            alert("Erro de conexão com o servidor.");
            console.error(error);
        }
    });
});
