document.addEventListener("DOMContentLoaded", () => {
    carregarCarrinho();
    document.getElementById("enderecoEntrega").addEventListener("change", atualizarResumo);
    document.getElementById("boleto").addEventListener("change", mostrarDadosCartao);
    document.getElementById("cartao").addEventListener("change", mostrarDadosCartao);
    document.getElementById("confirmarPedidoBtn").addEventListener("click", confirmarPedido);
});

function carregarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let tabelaResumoPedido = document.getElementById("tabelaResumoPedido");
    let totalCompra = 0;
    let freteSelecionado = parseFloat(localStorage.getItem("freteSelecionado")) || 0;

    tabelaResumoPedido.innerHTML = "";

    // Adiciona os itens do carrinho na tabela
    carrinho.forEach((produto) => {
        let subtotal = produto.preco * produto.quantidade;
        totalCompra += subtotal;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td class="text-start"><img src="${produto.imagem}" width="50" class="rounded me-2"> ${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>${produto.quantidade}</td>
            <td>R$ ${subtotal.toFixed(2)}</td>
        `;
        tabelaResumoPedido.appendChild(row);
    });

    // Exibe o valor do frete e o total da compra
    document.getElementById("freteResumo").innerText = freteSelecionado.toFixed(2);
    document.getElementById("totalResumo").innerText = (totalCompra + freteSelecionado).toFixed(2);
}

function atualizarResumo() {
    // Atualiza o resumo do pedido após selecionar o endereço
    let freteSelecionado = parseFloat(document.getElementById("frete").value) || 0;
    localStorage.setItem("freteSelecionado", freteSelecionado); // Salva o frete selecionado
    carregarCarrinho(); // Recarrega o carrinho com o novo valor de frete
}

function mostrarDadosCartao() {
    // Exibe ou oculta os campos de dados do cartão, dependendo da forma de pagamento
    let dadosCartao = document.getElementById("dadosCartao");
    if (document.getElementById("cartao").checked) {
        dadosCartao.classList.remove("d-none");
    } else {
        dadosCartao.classList.add("d-none");
    }
}

function confirmarPedido() {
    let enderecoEntrega = document.getElementById("enderecoEntrega").value;
    let pagamentoSelecionado = document.querySelector('input[name="pagamento"]:checked')?.value;
    let nomeCompleto = document.getElementById("nomeCompleto").value;
    let numeroCartao = document.getElementById("numeroCartao").value;
    let vencimento = document.getElementById("vencimento").value;
    let parcelas = document.getElementById("parcelas").value;

    // Verifica se todos os campos obrigatórios estão preenchidos
    if (!enderecoEntrega || !pagamentoSelecionado) {
        alert("Por favor, selecione um endereço de entrega e uma forma de pagamento.");
        return;
    }

    if (pagamentoSelecionado === "cartao" && (!nomeCompleto || !numeroCartao || !vencimento || !parcelas)) {
        alert("Por favor, preencha todos os campos de pagamento com cartão.");
        return;
    }

    // Valida o número do cartão (verifica se tem 16 dígitos)
    if (pagamentoSelecionado === "cartao" && !/^\d{16}$/.test(numeroCartao)) {
        alert("O número do cartão deve conter 16 dígitos.");
        return;
    }

    // Armazenar dados de pagamento (se necessário)
    if (pagamentoSelecionado === "cartao") {
        localStorage.setItem("dadosPagamento", JSON.stringify({
            nomeCompleto,
            numeroCartao,
            vencimento,
            parcelas
        }));
    }

    // Limpa o carrinho após finalização
    localStorage.removeItem("carrinho");

    // Redireciona para a página de confirmação do pedido (ajustado o caminho)
    window.location.href = "/pedido/confirmacao.html";  // Caminho ajustado
}
