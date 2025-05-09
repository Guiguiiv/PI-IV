function gerarNumeroPedido() {
    const numero = Math.floor(100000 + Math.random() * 900000); // Número de 6 dígitos
    document.getElementById("numero-pedido").textContent = numero;
}

function voltarLoja() {
    window.location.href = "/templates/produto/homeProdutosLogado.html"; // ajuste conforme sua página inicial
}

window.onload = gerarNumeroPedido;
