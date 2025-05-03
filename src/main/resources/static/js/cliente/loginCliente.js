document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("senha").value;

        try {
            const response = await fetch("http://localhost:8080/cliente/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, senha })
            });

            if (response.ok) {
                const cliente = await response.json();
                alert("Login realizado com sucesso!");

                // Salva no localStorage para manter o cliente logado
                localStorage.setItem("clienteLogado", JSON.stringify(cliente));

                // Redireciona para página de produtos (ou outra página protegida)
                window.location.href = "/PI-IV/templates/produto/carrinhoLogado.html";


            } else {
                const erro = await response.text();
                alert("Erro no login: " + erro);
            }
        } catch (error) {
            console.error("Erro na requisição:", error);
            alert("Erro ao tentar logar. Verifique sua conexão.");
        }
    });
});
