document.addEventListener("DOMContentLoaded", () => {
    const cepInput = document.getElementById("cep");
    const logradouroInput = document.getElementById("logradouro");
    const numeroInput = document.getElementById("numero");
    const complementoInput = document.getElementById("complemento");
    const bairroInput = document.getElementById("bairro");
    const cidadeInput = document.getElementById("cidade");
    const ufInput = document.getElementById("uf");

    // Formatar o CEP automaticamente para #####-###
    cepInput.addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, ''); // Remove tudo que não for número
        if (valor.length > 8) valor = valor.slice(0, 8); // Limita a 8 dígitos numéricos
        if (valor.length > 5) valor = valor.replace(/^(\d{5})(\d{1,3})/, "$1-$2"); // Aplica a máscara
        e.target.value = valor; // Atualiza o campo com o CEP formatado
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

            // Preencher os campos automaticamente
            logradouroInput.value = dados.logradouro;
            bairroInput.value = dados.bairro;
            cidadeInput.value = dados.localidade;
            ufInput.value = dados.uf;

        } catch (erro) {
            console.error("Erro ao buscar CEP:", erro);
            alert("Erro ao buscar o endereço. Tente novamente.");
        }
    });
});
