document.addEventListener("DOMContentLoaded", () => {
    const cepInput = document.getElementById("cep");
    const logradouroInput = document.getElementById("logradouro");
    const numeroInput = document.getElementById("numero");
    const complementoInput = document.getElementById("complemento");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const ufInput = document.getElementById("uf");
    const botaoCadastrar = document.querySelector(".btn-primary");

    // Formatar o CEP automaticamente
    cepInput.addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 8) valor = valor.slice(0, 8);
        if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d{1,3})/, "$1-$2");
        e.target.value = valor;
    });

    // Buscar endereço automaticamente ao sair do campo de CEP
    cepInput.addEventListener("blur", async () => {
        const cep = cepInput.value.replace(/\D/g, '');

        if (cep.length !== 8) {
            alert("CEP inválido. Digite 8 números.");
            return;
        }

        try {
            const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const dados = await resposta.json();

            if (dados.erro) {
                alert("CEP não encontrado.");
                return;
            }

            logradouroInput.value = dados.logradouro;
            bairroInput.value = dados.bairro;
            cidadeInput.value = dados.localidade;
            ufInput.value = dados.uf;

        } catch (erro) {
            console.error("Erro ao buscar CEP:", erro);
            alert("Erro ao buscar o endereço. Tente novamente.");
        }
    });

    // Enviar dados para o backend ao clicar em "Cadastrar"
    botaoCadastrar.addEventListener("click", async (e) => {
        e.preventDefault(); // Evita redirecionamento

        const endereco = {
            cep: cepInput.value,
            logradouro: logradouroInput.value,
            numero: numeroInput.value,
            complemento: complementoInput.value,
            bairro: bairroInput.value,
            cidade: cidadeInput.value,
            uf: ufInput.value,
            tipoEndereco: true, // ou false, dependendo da lógica desejada
            principal: true,    // ou false, dependendo da lógica desejada
            cliente: {
                id: 1 // Coloque aqui o ID do cliente logado ou selecionado
            }
        };

        try {
            const resposta = await fetch("http://localhost:8080/endereco", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(endereco)
            });

            if (resposta.ok) {
                alert("Endereço cadastrado com sucesso!");
                window.location.href = "/templates/cliente/naoLogado/loginCliente.html";
            } else {
                const erro = await resposta.text();
                alert("Erro ao cadastrar: " + erro);
            }

        } catch (erro) {
            console.error("Erro ao enviar:", erro);
            alert("Erro na conexão com o servidor.");
        }
    });
});
