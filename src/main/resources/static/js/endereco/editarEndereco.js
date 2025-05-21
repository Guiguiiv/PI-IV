document.addEventListener("DOMContentLoaded", async () => {
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    if (!clienteLogado) {
        alert("Nenhum cliente logado encontrado.");
        window.location.href = "loginCliente.html";
        return;
    }

    const listaEnderecos = document.getElementById("lista-enderecos");

    try {
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
                <div class="form-check form-switch mb-3">
                    <input class="form-check-input" type="radio" name="enderecoPrincipal" value="${endereco.id}" ${endereco.principal ? "checked" : ""}>
                    <label class="form-check-label">Selecionar como principal</label>
                </div>
                <div class="form-group mb-3">
                    <label>CEP</label>
                    <input type="text" class="form-control" value="${endereco.cep || ''}" readonly>
                </div>
                <div class="form-group mb-3">
                    <label>Logradouro</label>
                    <input type="text" class="form-control" value="${endereco.logradouro || ''}" readonly>
                </div>
                <div class="form-group mb-3">
                    <label>Número</label>
                    <input type="text" class="form-control" value="${endereco.numero || ''}" readonly>
                </div>
                <div class="form-group mb-3">
                    <label>Bairro</label>
                    <input type="text" class="form-control" value="${endereco.bairro || ''}" readonly>
                </div>
                <div class="form-group mb-3">
                    <label>Cidade</label>
                    <input type="text" class="form-control" value="${endereco.cidade || ''}" readonly>
                </div>
                <div class="form-group mb-3">
                    <label>Estado</label>
                    <input type="text" class="form-control" value="${endereco.uf || ''}" readonly>
                </div>
            `;

            listaEnderecos.appendChild(form);
        });

        // Evento para mudar o endereço principal
        listaEnderecos.addEventListener("change", async (event) => {
            if (event.target.name === "enderecoPrincipal") {
                const enderecoId = event.target.value;

                try {
                    const res = await fetch(`http://localhost:8080/endereco/${enderecoId}/definir-principal`, {
                        method: "PUT"
                    });

                    if (res.ok) {
                        alert("Endereço definido como principal com sucesso!");

                        // Atualiza visualmente os radios para refletir a mudança
                        const radios = listaEnderecos.querySelectorAll('input[name="enderecoPrincipal"]');
                        radios.forEach(radio => {
                            radio.checked = (radio.value === enderecoId);
                        });

                    } else {
                        alert("Erro ao definir endereço como principal.");
                    }
                } catch (error) {
                    console.error("Erro:", error);
                    alert("Erro ao definir endereço como principal.");
                }
            }
        });

    } catch (error) {
        console.error("Erro ao carregar endereços:", error);
        alert("Erro ao carregar os endereços.");
    }
});
