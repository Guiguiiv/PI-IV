document.addEventListener("DOMContentLoaded", async () => {
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    if (!clienteLogado) {
        alert("Nenhum cliente logado encontrado.");
        window.location.href = "loginCliente.html";
        return;
    }

    const listaEnderecos = document.getElementById("lista-enderecos");

    try {
        // Pega os dados completos do cliente, incluindo endereços
        const response = await fetch(`http://localhost:8080/cliente/id/${clienteLogado.id}`);
        if (!response.ok) throw new Error("Falha ao buscar cliente");

        const cliente = await response.json();

        if (!cliente.enderecos || cliente.enderecos.length === 0) {
            listaEnderecos.innerHTML = "<p>Você não possui endereços cadastrados.</p>";
            return;
        }

        cliente.enderecos.forEach((endereco) => {
            const form = document.createElement("form");
            form.classList.add("mb-5", "border", "p-3", "rounded", "bg-light");
            form.innerHTML = `
    <div class="form-group mb-3">
        <label>CEP</label>
        <input type="text" class="form-control cep" value="${endereco.cep || ''}" required>
    </div>
    <div class="form-group mb-3">
        <label>Logradouro</label>
        <input type="text" class="form-control logradouro" value="${endereco.logradouro || ''}" required>
    </div>
    <div class="form-group mb-3">
        <label>Número</label>
        <input type="text" class="form-control numero" value="${endereco.numero || ''}" required>
    </div>
    <div class="form-group mb-3">
        <label>Bairro</label>
        <input type="text" class="form-control bairro" value="${endereco.bairro || ''}" required>
    </div>
    <div class="form-group mb-3">
        <label>Cidade</label>
        <input type="text" class="form-control cidade" value="${endereco.cidade || ''}" required>
    </div>
    <div class="form-group mb-3">
        <label>Estado</label>
        <input type="text" class="form-control estado" value="${endereco.uf || ''}" required>
    </div>
    <button type="submit" class="btn btn-primary">Salvar alterações</button>
`;


            // Formatação de CEP: #####-###
            const cepInput = form.querySelector(".cep");
            cepInput.addEventListener("input", () => {
                cepInput.value = cepInput.value
                    .replace(/\D/g, "")
                    .replace(/^(\d{5})(\d{0,3})/, "$1-$2")
                    .substring(0, 9);
            });

            // Preenchimento automático via ViaCEP
            cepInput.addEventListener("blur", () => {
                const cep = cepInput.value.replace(/\D/g, "");
                if (cep.length === 8) {
                    fetch(`https://viacep.com.br/ws/${cep}/json/`)
                        .then((res) => res.json())
                        .then((data) => {
                            if (!data.erro) {
                                form.querySelector(".logradouro").value = data.logradouro || "";
                                form.querySelector(".bairro").value = data.bairro || "";
                                form.querySelector(".cidade").value = data.localidade || "";
                                form.querySelector(".estado").value = data.uf || "";
                            } else {
                                alert("CEP não encontrado.");
                            }
                        })
                        .catch(() => alert("Erro ao buscar CEP."));
                }
            });

            // Submit do formulário para atualizar endereço
            form.addEventListener("submit", async (event) => {
                event.preventDefault();

                const enderecoAtualizado = {
                    cep: cepInput.value,
                    logradouro: form.querySelector(".logradouro").value,
                    numero: form.querySelector(".numero").value,
                    bairro: form.querySelector(".bairro").value,
                    cidade: form.querySelector(".cidade").value,
                    uf: form.querySelector(".estado").value,
                };

                try {
                    const res = await fetch(`http://localhost:8080/endereco/${endereco.id}`, {
                        method: "PUT",
                        headers: {"Content-Type": "application/json"},
                        body: JSON.stringify(enderecoAtualizado),
                    });

                    if (res.ok) {
                        alert("Endereço atualizado com sucesso!");
                    } else {
                        alert("Erro ao atualizar endereço.");
                    }
                } catch (error) {
                    console.error("Erro:", error);
                    alert("Erro ao atualizar endereço.");
                }
            });

            listaEnderecos.appendChild(form);
        });
    } catch (error) {
        console.error("Erro ao carregar endereços:", error);
        alert("Erro ao carregar os endereços.");
    }
});
