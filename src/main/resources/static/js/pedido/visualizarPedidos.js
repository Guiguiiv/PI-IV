// Função para preencher a tabela com os pedidos do localStorage
// Função para buscar pedidos do backend
async function carregarPedidos() {
    try {
        const response = await fetch("http://localhost:8080/pedidos"); // ajuste a URL se necessário
        const pedidos = await response.json();

        const tbody = document.querySelector("tbody");
        tbody.innerHTML = "";

        pedidos.forEach(pedido => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
                <td>#${pedido.numeroPedido}</td>
                <td>${formatarData(pedido.dtPedido)}</td>
                <td>R$ ${pedido.valorTotal.toFixed(2)}</td>
                <td>${gerarBadgeStatus(pedido.status)}</td>
                <td><button class="btn btn-info btn-sm" onclick="mostrarDetalhes(${pedido.numeroPedido})">Mais Detalhes</button></td>
            `;

            tbody.appendChild(tr);
        });
    } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
    }
}

// Converte data do formato ISO para dd/mm/aaaa
function formatarData(dataISO) {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR");
}

function gerarBadgeStatus(status) {
    let classe = "bg-secondary";
    if (status === "Finalizado") classe = "bg-success";
    else if (status === "Em Processamento") classe = "bg-warning";
    else if (status === "Cancelado") classe = "bg-danger";
    else if (status === "aguardando pagamento") classe = "bg-primary";

    return `<span class="badge ${classe}">${status}</span>`;
}

function mostrarDetalhes(numeroPedido) {
    alert(`Você clicou em detalhes do pedido #${numeroPedido}`);
}

window.onload = carregarPedidos;


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
