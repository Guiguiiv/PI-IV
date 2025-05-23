async function carregarPedidos() {
    const clienteLogado = localStorage.getItem("clienteLogado");
    if (!clienteLogado) {
        alert("Cliente não logado.");
        return;
    }

    // Parseia o JSON para obter o objeto cliente
    let cliente;
    try {
        cliente = JSON.parse(clienteLogado);
    } catch (e) {
        console.error("Erro ao parsear cliente logado:", e);
        alert("Erro ao processar dados do cliente.");
        return;
    }


    const idCliente = cliente.id;
    console.log("ID do cliente logado:", idCliente);  // <-- aqui

    if (!idCliente) {
        alert("ID do cliente não encontrado.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/pedidos/cliente/${idCliente}`);
        if (!response.ok) throw new Error("Erro ao buscar pedidos");

        const pedidos = await response.json();
        const tbody = document.querySelector("tbody");
        tbody.innerHTML = "";

        pedidos.forEach(pedido => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>#${pedido.numeroPedido}</td>
                <td>${new Date(pedido.dtPedido).toLocaleDateString()}</td>
                <td>R$ ${pedido.valorTotal.toFixed(2)}</td>
                <td>${gerarBadgeStatus(pedido.status)}</td>
                <td><button class="btn btn-info btn-sm" onclick="mostrarDetalhes(${pedido.numeroPedido})">Mais Detalhes</button></td>
            `;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        alert("Não foi possível carregar os pedidos.");
    }
}
