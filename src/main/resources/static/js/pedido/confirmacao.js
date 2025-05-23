// Exibe saudação com o nome do cliente logado
function exibirSaudacaoCliente() {
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    if (clienteLogado && clienteLogado.nomeCompleto) {
        const primeiroNome = clienteLogado.nomeCompleto.split(" ")[0];
        document.getElementById("saudacaoCliente").textContent = `Olá, ${primeiroNome}`;
    }
}

// Preenche os dados do pedido na tela
function preencherResumoPedido(pedidoBackend) {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const endereco = JSON.parse(localStorage.getItem("enderecoEntrega")) || {};
    const tipoPagamento = localStorage.getItem("pagamentoSelecionado") || "Não informado";
    const pagamento = JSON.parse(localStorage.getItem("dadosPagamento"));
    const frete = parseFloat(localStorage.getItem("freteSelecionado")) || 0;
    const total = parseFloat(localStorage.getItem("valorTotal")) || 0;

    // Se recebeu o pedido do backend, usa ele para preencher valores dinâmicos
    const numeroPedido = pedidoBackend?.numeroPedido || 0;
    const valorTotal = pedidoBackend?.valorTotal || total;
    const valorFrete = pedidoBackend?.valorFrete || frete;
    const formaPagamentoBackend = pedidoBackend?.formaPagamento || (tipoPagamento === "cartao" ? "cartao" : "boleto");

    // Atualiza o número do pedido
    document.getElementById("numero-pedido").textContent = numeroPedido;

    // Preenche valores
    document.getElementById("valor-total").textContent = `R$ ${valorTotal.toFixed(2)}`;
    document.getElementById("valor-frete").textContent = `R$ ${valorFrete.toFixed(2)}`;
    document.getElementById("forma-pagamento").textContent =
        formaPagamentoBackend === "cartao" && pagamento?.numeroCartao
            ? `Cartão •••• ${pagamento.numeroCartao.slice(-4)}`
            : "Boleto bancário";

    document.getElementById("endereco-entrega").textContent =
        `${endereco.logradouro || "Endereço não informado"}, ${endereco.numero || ""} - ${endereco.bairro || ""}, ${endereco.cidade || ""} - ${endereco.uf || ""}`.trim();

    // Preenche produtos
    const listaProdutos = document.getElementById("lista-produtos");
    listaProdutos.innerHTML = ""; // limpa antes
    carrinho.forEach(produto => {
        const item = document.createElement("li");
        item.className = "list-group-item d-flex justify-content-between align-items-center";
        item.innerHTML = `
            <span>${produto.nome} (x${produto.quantidade})</span>
            <span>R$ ${(produto.preco * produto.quantidade).toFixed(2)}</span>
        `;
        listaProdutos.appendChild(item);
    });
}

function montarPedidoParaEnvio() {
    const dataAtual = new Date().toISOString();
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado")) || {};
    const endereco = JSON.parse(localStorage.getItem("enderecoEntrega")) || {};

    const tipoPagamento = localStorage.getItem("pagamentoSelecionado") || "boleto";
    const frete = parseFloat(localStorage.getItem("freteSelecionado")) || 0;
    const total = parseFloat(localStorage.getItem("valorTotal")) || 0;

    const formaPagamento = tipoPagamento === "cartao" ? "cartao" : "boleto";

    return {
        cliente: { id: parseInt(clienteLogado.idCliente || clienteLogado.id) },
        endereco: { id: parseInt(endereco.id || endereco.id_endereco) },
        formaPagamento: formaPagamento,
        valorFrete: frete,
        valorTotal: total,
        dtPedido: dataAtual,
        status: "Aguardando Pagamento"
    };
}

// Função para enviar o pedido para o backend e atualizar a tela com o pedido criado
function enviarPedido() {
    const pedido = montarPedidoParaEnvio();
    console.log("Pedido a enviar:", pedido);

    if (!pedido.cliente.id) {
        console.error("Erro: cliente.id não definido");
        return;
    }
    if (!pedido.endereco.id) {
        console.error("Erro: endereco.id não definido");
        return;
    }

    fetch('http://localhost:8080/pedidos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(pedido)
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    console.error("Erro do backend:", text);
                    throw new Error("Erro ao salvar pedido");
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Pedido salvo com sucesso:", data);
            localStorage.removeItem("carrinho");

            // Atualiza a tela com os dados do pedido retornado pelo backend (incluindo o número)
            preencherResumoPedido(data);
            exibirSaudacaoCliente();
        })
        .catch(error => {
            console.error("Falha ao salvar pedido:", error);
            // Aqui você pode mostrar mensagem de erro na tela se quiser
        });
}

// Executa ao carregar a página: só chama enviarPedido para iniciar fluxo
window.onload = function () {
    exibirSaudacaoCliente();
    preencherResumoPedido();
    enviarPedido();
};
