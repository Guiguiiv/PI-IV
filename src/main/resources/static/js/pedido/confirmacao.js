// Função para gerar número de pedido aleatório de 6 dígitos
function gerarNumeroPedido() {
    const numero = Math.floor(100000 + Math.random() * 900000);
    document.getElementById("numero-pedido").textContent = numero;

    // Salvando número no localStorage para visualizar depois nos "Meus Pedidos"
    const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];
    const novoPedido = {
        numero: numero,
        data: new Date().toLocaleDateString('pt-BR'),
        valor: localStorage.getItem("valorTotal") || "R$ 0,00", // opcional
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

// Executa ao carregar a página
window.onload = function () {
    gerarNumeroPedido();
    exibirSaudacaoCliente();
}
