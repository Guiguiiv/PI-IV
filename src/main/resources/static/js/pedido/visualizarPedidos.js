document.addEventListener("DOMContentLoaded", () => {
    const tabelaPedidos = document.querySelector("table tbody");

    // Elementos do modal
    const modal = new bootstrap.Modal(document.getElementById("modalDetalhesPedido"));
    const modalNumero = document.getElementById("modal-numero");
    const modalData = document.getElementById("modal-data");
    const modalValor = document.getElementById("modal-valor");
    const modalStatusAtual = document.getElementById("modal-status-atual");
    const selectStatus = document.getElementById("select-status");
    const modalAlerta = document.getElementById("modal-alerta");
    const formStatusPedido = document.getElementById("formStatusPedido");

    let pedidosCache = [];
    let pedidoSelecionado = null;

    // Supondo que clienteLogado está disponível, ex:
    // const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    // ou outra forma de obter o cliente logado
    const clienteLogado = window.clienteLogado || JSON.parse(localStorage.getItem("clienteLogado"));
    if (!clienteLogado || !clienteLogado.id) {
        tabelaPedidos.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Cliente não logado.</td></tr>`;
        return;
    }

    // Formatar data no formato dd/mm/aaaa
    function formatarData(dataISO) {
        const data = new Date(dataISO);
        const dia = String(data.getDate()).padStart(2, "0");
        const mes = String(data.getMonth() + 1).padStart(2, "0");
        const ano = data.getFullYear();
        return `${dia}/${mes}/${ano}`;
    }

    // Gerar badge colorida para status
    function badgeStatus(status) {
        switch (status.toLowerCase()) {
            case "finalizado":
            case "pagamento efetuado":
                return '<span class="badge bg-success">Pagamento Efetuado</span>';
            case "em processamento":
            case "saiu para entrega":
                return '<span class="badge bg-warning text-dark">Saiu para Entrega</span>';
            case "cancelado":
                return '<span class="badge bg-danger">Cancelado</span>';
            case "entregue":
                return '<span class="badge bg-primary">Entregue</span>';
            default:
                return `<span class="badge bg-secondary">${status}</span>`;
        }
    }

    // Criar linha da tabela para um pedido
    function criarLinhaPedido(pedido) {
        return `
            <tr data-id="${pedido.idPedido}">
                <td>#${pedido.numeroPedido}</td>
                <td>${formatarData(pedido.dtPedido)}</td>
                <td>R$ ${pedido.valorTotal.toFixed(2).replace(".", ",")}</td>
                <td>${badgeStatus(pedido.status)}</td>
            </tr>
        `;
    }

    // Carregar a tabela com os pedidos
    function carregarTabela(pedidos) {
        if (pedidos.length === 0) {
            tabelaPedidos.innerHTML = `<tr><td colspan="5" class="text-center">Nenhum pedido encontrado.</td></tr>`;
            return;
        }

        tabelaPedidos.innerHTML = pedidos.map(criarLinhaPedido).join("");

        // Adicionar evento nos botões para abrir modal
        document.querySelectorAll(".btn-detalhes").forEach(btn => {
            btn.addEventListener("click", (e) => {
                const idPedido = e.target.getAttribute("data-id");
                abrirModalDetalhes(idPedido);
            });
        });
    }


    // Exibir alerta dentro do modal
    function mostrarAlerta(mensagem, tipo) {
        modalAlerta.textContent = mensagem;
        modalAlerta.className = "alert alert-" + tipo;
        modalAlerta.classList.remove("d-none");
    }

    // Enviar atualização do status do pedido ao backend
    formStatusPedido.addEventListener("submit", (event) => {
        event.preventDefault();

        const novoStatus = selectStatus.value.trim();
        if (!novoStatus) {
            mostrarAlerta("Selecione um status válido.", "danger");
            return;
        }

        if (novoStatus.toLowerCase() === (pedidoSelecionado.status || "").toLowerCase()) {
            mostrarAlerta("O status selecionado é igual ao atual.", "warning");
            return;
        }

        fetch(`http://localhost:8080/pedidos/${pedidoSelecionado.idPedido}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                ...pedidoSelecionado,
                status: novoStatus
            })
        })
            .then(response => {
                if (!response.ok) throw new Error("Erro ao atualizar status");
                return response.json();
            })
            .then(pedidoAtualizado => {
                // Atualizar cache
                const index = pedidosCache.findIndex(p => p.idPedido === pedidoAtualizado.idPedido);
                if (index !== -1) pedidosCache[index] = pedidoAtualizado;

                // Atualizar linha na tabela
                const linha = tabelaPedidos.querySelector(`tr[data-id="${pedidoAtualizado.idPedido}"]`);
                if (linha) linha.children[3].innerHTML = badgeStatus(pedidoAtualizado.status);

                // Atualizar status no modal
                modalStatusAtual.innerHTML = badgeStatus(pedidoAtualizado.status);

                mostrarAlerta("Status atualizado com sucesso!", "success");
                pedidoSelecionado = pedidoAtualizado;
            })
            .catch(error => {
                console.error(error);
                mostrarAlerta("Falha ao atualizar o status. Tente novamente.", "danger");
            });
    });

    // Buscar pedidos do cliente logado ao carregar a página
    fetch(`http://localhost:8080/pedidos/cliente/${clienteLogado.id}`)
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar pedidos: " + response.statusText);
            return response.json();
        })
        .then(pedidos => {
            pedidosCache = pedidos;
            carregarTabela(pedidosCache);
        })
        .catch(error => {
            tabelaPedidos.innerHTML = `<tr><td colspan="5" class="text-center text-danger">Erro ao carregar pedidos.</td></tr>`;
            console.error(error);
        });
});
