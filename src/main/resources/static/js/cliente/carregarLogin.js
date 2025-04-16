document.addEventListener("DOMContentLoaded", function () {
    const clienteLogado = localStorage.getItem("clienteLogado");
    if (clienteLogado) {
        try {
            const cliente = JSON.parse(clienteLogado);
            const saudacao = document.getElementById("saudacaoCliente");
            const primeiroNome = cliente.nome.split(" ")[0];
            saudacao.textContent = `Olá, ${primeiroNome}!`;
        } catch (e) {
            console.error("Erro ao processar cliente logado:", e);
        }
    }

    const botaoSair = document.getElementById("confirmarSaida");
    if (botaoSair) {
        botaoSair.addEventListener("click", function () {
            if (localStorage.getItem("clienteLogado")) {
                localStorage.removeItem("clienteLogado");
            }
            // Redireciona para a tela de produtos
            window.location.href = "/templates/produto/homeProdutosLogado.html?_ijt=uq0f7hh9gkd9jpge6fpep53sqe";
        });
    }
});