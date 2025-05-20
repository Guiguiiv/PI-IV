document.addEventListener("DOMContentLoaded", () => {
    const clienteLogado = localStorage.getItem("clienteLogado");

    let idCliente = null;
    if (clienteLogado) {
        try {
            const cliente = JSON.parse(clienteLogado);
            idCliente = cliente.id; // Aqui você extrai o ID do cliente
        } catch (e) {
            console.error("Erro ao processar cliente logado:", e);
        }
    }

    carregarCarrinho();

    if (idCliente) {
        carregarEnderecos(idCliente);
    } else {
        alert("Você precisa estar logado para continuar com o checkout.");
    }

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
    document.getElementById("freteResumo").textContent = freteSelecionado.toFixed(2);
    document.getElementById("totalResumo").textContent = (totalCompra + freteSelecionado).toFixed(2);
}


function atualizarResumo() {
    // Atualiza o resumo do pedido após selecionar o endereço
    let freteSelecionado = parseFloat(document.getElementById("freteResumo").value) || 0;
    localStorage.setItem("freteSelecionado", freteSelecionado); // Salva o frete selecionado
    carregarCarrinho(); // Recarrega o carrinho com o novo valor de frete


}


function carregarEnderecos(idCliente) {
    const select = document.getElementById("enderecoEntrega");
    select.innerHTML = '<option value="">Selecione um endereço</option>';

    fetch(`http://localhost:8080/endereco/cliente/${idCliente}`)
        .then(response => response.json())
        .then(enderecos => {
            if (enderecos.length > 0) {
                enderecos.forEach(endereco => {
                    const option = document.createElement("option");
                    option.value = endereco.id;
                    option.textContent = endereco.logradouro;
                    select.appendChild(option);
                });
            } else {
                const option = document.createElement("option");
                option.value = "";
                option.textContent = "Você ainda não cadastrou endereços.";
                select.appendChild(option);
            }
        })
        .catch(error => {
            console.error("Erro ao carregar endereços:", error);
            alert("Houve um erro ao carregar os endereços.");
        });
}


function mostrarDadosCartao() {
    const dadosCartao = document.getElementById("dadosCartao");
    const cartaoSelecionado = document.getElementById("cartao").checked;
    dadosCartao.classList.toggle("d-none", !cartaoSelecionado);
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

    // Salva endereço no localStorage
    // Salva endereço
    const enderecoSelecionadoTexto = document.getElementById("enderecoEntrega").selectedOptions[0].textContent;
    localStorage.setItem("enderecoEntrega", JSON.stringify({
        id: enderecoEntrega,
        logradouro: enderecoSelecionadoTexto
    }));

// Salva valor total
    let totalResumo = parseFloat(document.getElementById("totalResumo").textContent.replace(",", "."));
    localStorage.setItem("valorTotal", totalResumo);


    // Redireciona para a página de confirmação do pedido (ajustado o caminho)
    window.location.href = "/PI-IV/templates/pedido/confirmacao.html";  // Caminho ajustado
}
