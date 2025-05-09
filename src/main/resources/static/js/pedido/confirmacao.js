async function gerarNumeroPedido() {
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));

    const pedido = {
        clienteId: clienteLogado?.id, // ou ajuste conforme o modelo
        valorTotal: localStorage.getItem("valorTotal") || 0
    };

    try {
        const response = await fetch("http://localhost:8080/pedidos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });

        const data = await response.json();

        // Exibe número do pedido na tela
        document.getElementById("numero-pedido").textContent = data.numeroPedido;

    } catch (error) {
        console.error("Erro ao criar pedido:", error);
    }
}

function exibirSaudacaoCliente() {
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));
    if (clienteLogado && clienteLogado.nomeCompleto) {
        const primeiroNome = clienteLogado.nomeCompleto.split(" ")[0];
        document.getElementById("saudacaoCliente").textContent = `Olá, ${primeiroNome}`;
    }
}

window.onload = function () {
    gerarNumeroPedido();
    exibirSaudacaoCliente();
};
