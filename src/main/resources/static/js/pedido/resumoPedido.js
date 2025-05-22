document.addEventListener("DOMContentLoaded", () => {
    const carrinho = JSON.parse(localStorage.getItem("carrinhoResumo")) || [];
    const endereco = JSON.parse(localStorage.getItem("enderecoEntrega")) || {};
    const pagamento = JSON.parse(localStorage.getItem("dadosPagamento"));
    const tipoPagamento = localStorage.getItem("pagamentoSelecionado") || "Não informado";
    const frete = parseFloat(localStorage.getItem("freteSelecionado")) || 0;

    const tabela = document.getElementById("tabelaResumoPedido");
    let totalCompra = 0;

    tabela.innerHTML = "";

    carrinho.forEach(produto => {
        const subtotal = produto.preco * produto.quantidade;
        totalCompra += subtotal;

        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="text-start"><img src="${produto.imagem}" width="50" class="rounded me-2"> ${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${subtotal.toFixed(2)}</td>
        `;
        tabela.appendChild(row);
    });

    // Atualiza valores finais
    document.getElementById("freteResumo").textContent = frete.toFixed(2);
    document.getElementById("totalResumo").textContent = (totalCompra + frete).toFixed(2);

    // Exibe endereço
    document.getElementById("resumoEndereco").textContent = endereco.logradouro || "Não informado";

    // Exibe forma de pagamento
    if (tipoPagamento === "cartao" && pagamento?.numeroCartao) {
        document.getElementById("resumoPagamento").textContent =
            `Cartão •••• ${pagamento.numeroCartao.slice(-4)}`;
    } else {
        document.getElementById("resumoPagamento").textContent = "Boleto bancário";
    }

    // Botão de finalizar pedido
    document.getElementById("finalizarPedidoBtn").addEventListener("click", () => {
        alert("Pedido finalizado com sucesso!");


        window.location.href = "/PI-IV/templates/pedido/confirmacao.html";
    });
});
