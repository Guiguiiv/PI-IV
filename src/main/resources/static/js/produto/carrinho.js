document.addEventListener("DOMContentLoaded", () => {
    carregarCarrinho();
});

function mascaraCEP(input) {
    var cep = input.value.replace(/\D/g, '');
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

        tabela.innerHTML += `
            <tr>
                <td class="text-start"><img src="${produto.imagem}" width="50" class="rounded me-2"> ${produto.nome}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td>
                    <input type="number" value="${produto.quantidade}" min="1" class="form-control text-center" style="width: 80px;" onchange="alterarQuantidade(${index}, this.value)">
                </td>
                <td>R$ ${subtotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="removerDoCarrinho(${index})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    });

    document.getElementById("totalCompra").innerText = totalCompra.toFixed(2);
    calcularFrete();
}

function calcularFrete() {
    let freteSelecionado = parseFloat(document.getElementById("frete").value) || 0;
    let totalCompra = parseFloat(document.getElementById("totalCompra").innerText);
    let totalFinal = totalCompra + freteSelecionado;

    document.getElementById("valorFrete").innerText = freteSelecionado.toFixed(2);
    document.getElementById("totalCompra").innerText = totalFinal.toFixed(2);
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


// VERIFICAÇÃO DE LOGIN AO FINALIZAR COMPRA
function finalizarCompra() {
    const cliente = JSON.parse(localStorage.getItem("clienteLogado"));
    console.log("Cliente logado:", cliente); // Verifique no console se o cliente está correto

    // Verifique se o cliente está logado
    if (!cliente) {
        alert("Você precisa estar logado para finalizar a compra.");
         window.location.href = "/PI-IV/templates/cliente/naoLogado/loginCliente.html"; // Redireciona para a página de login
    } else {
        alert("Compra finalizada com sucesso!");

        // Limpa o carrinho após a compra
        localStorage.removeItem("carrinho");

        // Redireciona para uma página de sucesso (pode ser uma página de confirmação de pedido)
    }

}
