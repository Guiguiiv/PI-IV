// Função para gerar número de pedido aleatório de 6 dígitos
function gerarNumeroPedido() {
    const numero = Math.floor(100000 + Math.random() * 900000);
    document.getElementById("numero-pedido").textContent = numero;

    // Salvando número no localStorage para visualizar depois nos "Meus Pedidos"
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const novoPedido = {
        numero: numero,
        data: new Date().toLocaleDateString('pt-BR'),
        valor: localStorage.getItem("valorTotal") || "R$ 0,00",
        status: "Finalizado"
    };
    pedidos.push(novoPedido);
    localStorage.setItem("pedidos", JSON.stringify(pedidos));
}

// Exibe saudação com o nome do cliente logado
function exibirSaudacaoCliente() {
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    if (clienteLogado && clienteLogado.nomeCompleto) {
        const primeiroNome = clienteLogado.nomeCompleto.split(" ")[0];
        document.getElementById("saudacaoCliente").textContent = `Olá, ${primeiroNome}`;
    }
}

// Preenche os dados do pedido na tela
function preencherResumoPedido() {
    const carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    const endereco = JSON.parse(localStorage.getItem("enderecoEntrega")) || {};
    const tipoPagamento = localStorage.getItem("pagamentoSelecionado") || "Não informado";
    const pagamento = JSON.parse(localStorage.getItem("dadosPagamento"));
    const frete = parseFloat(localStorage.getItem("freteSelecionado")) || 0;
    const total = parseFloat(localStorage.getItem("valorTotal")) || 0;

    // Preenche valores
    document.getElementById("valor-total").textContent = `R$ ${total.toFixed(2)}`;
    document.getElementById("valor-frete").textContent = `R$ ${frete.toFixed(2)}`;
    document.getElementById("forma-pagamento").textContent =
        tipoPagamento === "cartao" && pagamento?.numeroCartao
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
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado")) || {};
    const endereco = JSON.parse(localStorage.getItem("enderecoEntrega")) || {};
    console.log("Endereço carregado do localStorage:", endereco);

    const tipoPagamento = localStorage.getItem("pagamentoSelecionado") || "boleto";
    const frete = parseFloat(localStorage.getItem("freteSelecionado")) || 0;
    const total = parseFloat(localStorage.getItem("valorTotal")) || 0;

    const formaPagamento = tipoPagamento === "cartao" ? "cartao" : "boleto";

    return {
        cliente: { id: clienteLogado.idCliente || clienteLogado.id },
        endereco: { id: endereco.id || endereco.id_endereco },
        formaPagamento: formaPagamento,
        valorFrete: frete,
        valorTotal: total
    };
}

// Função para enviar o pedido para o backend
function enviarPedido() {
    const pedido = montarPedidoParaEnvio();
    console.log("Pedido a enviar:", pedido);

    // Validar se tem id do cliente e endereço para evitar erro no backend
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
            // Aqui pode limpar localStorage ou redirecionar o usuário
        })
        .catch(error => {
            console.error("Falha ao salvar pedido:", error);
        });
}

// Executa ao carregar a página
window.onload = function () {
    gerarNumeroPedido();
    exibirSaudacaoCliente();
    preencherResumoPedido();
    enviarPedido();
};
