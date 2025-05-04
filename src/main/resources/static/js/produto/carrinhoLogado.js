document.addEventListener("DOMContentLoaded", () => {
    carregarCarrinho();
    document.getElementById("frete").addEventListener("change", calcularFrete);
    document.getElementById("cep").addEventListener("input", (e) => mascaraCEP(e.target));
    document.getElementById("finalizarCompraBtn").addEventListener("click", finalizarCompra);
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

    document.querySelectorAll(".quantidade").forEach(input => {
        input.addEventListener("change", e => {
            const index = parseInt(e.target.dataset.index);
            alterarQuantidade(index, e.target.value);
        });
    });

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
    localStorage.setItem("freteSelecionado", freteSelecionado); // já está calculado anteriormente

}

function finalizarCompra() {
    let freteSelecionado = document.getElementById("frete").value;
    let cep = document.getElementById("cep").value;

    if (!freteSelecionado || !cep) {
        alert("Por favor, selecione o frete e preencha o CEP.");
        return;
    }

    localStorage.setItem("freteSelecionado", parseFloat(freteSelecionado)); // <-- isso aqui

    localStorage.removeItem("carrinho");
    window.location.href = "/src/main/resources/templates/pedido/checkout.html";
}
