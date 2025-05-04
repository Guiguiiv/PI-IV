document.addEventListener("DOMContentLoaded", () => {
    carregarCarrinho();
    document.getElementById("frete").addEventListener("change", calcularFrete);
    document.getElementById("cep").addEventListener("input", (e) => mascaraCEP(e.target));
    document.getElementById("finalizarCompraBtn").addEventListener("click", finalizarCompra);
});

function mascaraCEP(input) {
    var cep = input.value.replace(/\D/g, ''); // Remove qualquer coisa que não seja número
    if (cep.length <= 5) {
        input.value = cep.replace(/(\d{5})(\d{0,3})/, '$1-$2');
    } else {
        input.value = cep.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
}

function carregarCarrinho() {
    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    let tabela = document.getElementById("carrinhoTabela");
    let totalCompra = 0;
    tabela.innerHTML = "";

    carrinho.forEach((produto, index) => {
        let subtotal = produto.preco * produto.quantidade;
        totalCompra += subtotal;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td class="text-start"><img src="${produto.imagem}" width="50" class="rounded me-2"> ${produto.nome}</td>
            <td>R$ ${produto.preco.toFixed(2)}</td>
            <td>
                <input type="number" value="${produto.quantidade}" min="1" class="form-control text-center quantidade" style="width: 80px;" data-index="${index}">
            </td>
            <td>R$ ${subtotal.toFixed(2)}</td>
            <td>
                <button class="btn btn-danger btn-sm remover" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </td>
        `;
        tabela.appendChild(row);
    });

    document.getElementById("totalCompra").innerText = totalCompra.toFixed(2);
    calcularFrete();

    // Adicionando eventos aos inputs de quantidade
    document.querySelectorAll(".quantidade").forEach(input => {
        input.addEventListener("change", e => {
            const index = parseInt(e.target.dataset.index);
            alterarQuantidade(index, e.target.value);
        });
    });

    // Adicionando eventos aos botões de remover
    document.querySelectorAll(".remover").forEach(botao => {
        botao.addEventListener("click", e => {
            const index = parseInt(e.currentTarget.dataset.index);
            removerDoCarrinho(index);
        });
    });
}

function alterarQuantidade(index, quantidade) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho"));
    carrinho[index].quantidade = parseInt(quantidade);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    carregarCarrinho();
}

function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem("carrinho"));
    carrinho.splice(index, 1);
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
    carregarCarrinho();
}

function calcularFrete() {
    let freteSelecionado = parseFloat(document.getElementById("frete").value) || 0;
    let totalCompra = 0;

    let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];
    carrinho.forEach(produto => {
        totalCompra += produto.preco * produto.quantidade;
    });

    document.getElementById("valorFrete").innerText = freteSelecionado.toFixed(2);
    document.getElementById("totalCompra").innerText = (totalCompra + freteSelecionado).toFixed(2);
}

async function finalizarCompra() {
    let freteSelecionado = document.getElementById("frete").value;
    let cep = document.getElementById("cep").value;

    if (!freteSelecionado || !cep) {
        alert("Por favor, selecione o frete e preencha o CEP.");
        return;
    }

    // Exemplo fictício: dados de cliente e endereço já disponíveis
    const clienteId = 1; // Substitua conforme necessário
    const enderecoId = 1; // Substitua conforme necessário

    const pedido = {
        dtPedido: new Date(), // Data atual
        cliente: { idCliente: clienteId },
        endereco: { idEndereco: enderecoId },
        formaPagamento: "Cartão de Crédito", // ou outra forma definida
        valorFrete: parseFloat(freteSelecionado)
    };

    try {
        const response = await fetch("http://localhost:8080/pedidos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
        });

        if (response.ok) {
            alert("Compra finalizada com sucesso!");
            localStorage.removeItem("carrinho"); // limpa o carrinho
            window.location.reload(); // ou redirecionar para uma tela de sucesso
        } else {
            alert("Erro ao finalizar compra. Tente novamente.");
        }
    } catch (error) {
        console.error("Erro ao enviar pedido:", error);
        alert("Erro na comunicação com o servidor.");
    }
}
