document.addEventListener("DOMContentLoaded", async () => {
    const cepInput = document.getElementById("cep");
    const form = document.getElementById("formEditarEndereco");

    // Recupera os dados do cliente logado
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));

    if (!clienteLogado) {
        alert("Nenhum cliente logado encontrado.");
        window.location.href = "loginCliente.html";
        return;
    }

    // Usando o id do cliente para buscar o endereço no backend
    const idCliente = clienteLogado.id;
    let endereco = null;

    try {
        const response = await fetch(`http://localhost:8080/enderecos/${idCliente}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar endereço.");
        }
        endereco = await response.json();

        // Preenche os campos com os dados do endereço
        document.getElementById("cep").value = endereco.cep;
        document.getElementById("logradouro").value = endereco.logradouro;
        document.getElementById("numero").value = endereco.numero;
        document.getElementById("bairro").value = endereco.bairro;
        document.getElementById("cidade").value = endereco.cidade;
        document.getElementById("estado").value = endereco.uf;

    } catch (error) {
        console.error("Erro ao carregar endereço:", error);
        alert("Não foi possível carregar os dados do endereço.");
    }

    // Formatador de CEP
    cepInput.addEventListener("input", () => {
        cepInput.value = cepInput.value
            .replace(/\D/g, "")
            .replace(/^(\d{5})(\d{0,3})/, "$1-$2")
            .substring(0, 9);
    });

    // Preenchimento automático via API
    cepInput.addEventListener("blur", () => {
        const cep = cepInput.value.replace(/\D/g, "");
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(res => res.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById("rua").value = data.logradouro;
                        document.getElementById("bairro").value = data.bairro;
                        document.getElementById("cidade").value = data.localidade;
                        document.getElementById("estado").value = data.uf;
                    } else {
                        alert("CEP não encontrado.");
                    }
                })
                .catch(() => alert("Erro ao buscar CEP."));
        }
    });

    // Submissão do formulário
    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const enderecoAtualizado = {
            cep: document.getElementById("cep").value,
            logradouro: document.getElementById("logradouro").value,
            numero: document.getElementById("numero").value,
            bairro: document.getElementById("bairro").value,
            cidade: document.getElementById("cidade").value,
            uf: document.getElementById("estado").value
        };

        try {
            const response = await fetch(`http://localhost:8080/enderecos/${endereco.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(enderecoAtualizado)
            });

            if (response.ok) {
                alert("Endereço atualizado com sucesso!");
                window.location.href = "/templates/endereco/listarEnderecos.html";
            } else {
                alert("Erro ao atualizar endereço.");
            }
        } catch (error) {
            console.error("Erro:", error);
            alert("Erro ao atualizar endereço.");
        }
    });
});
