// Função para preencher a tabela com os pedidos do localStorage
function carregarPedidos() {
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = ""; // limpa conteúdo anterior

    pedidos.forEach(pedido => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>#${pedido.numero}</td>
            <td>${pedido.data}</td>
            <td>${pedido.valor}</td>
            <td>${gerarBadgeStatus(pedido.status)}</td>
            <td><button class="btn btn-info btn-sm" onclick="mostrarDetalhes(${pedido.numero})">Mais Detalhes</button></td>
        `;

        tbody.appendChild(tr);
    });
}

// Gera o HTML do badge com base no status do pedido
function gerarBadgeStatus(status) {
    let classe = "bg-secondary";
    if (status === "Finalizado") classe = "bg-success";
    else if (status === "Em Processamento") classe = "bg-warning";
    else if (status === "Cancelado") classe = "bg-danger";

    return `<span class="badge ${classe}">${status}</span>`;
}

// Exemplo de ação para botão "Mais Detalhes"
function mostrarDetalhes(numeroPedido) {
    alert(`Você clicou em detalhes do pedido #${numeroPedido}`);
}

// Executa ao carregar a página
window.onload = carregarPedidos;
