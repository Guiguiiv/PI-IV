document.addEventListener("DOMContentLoaded", function () {
    // Pega o ID do produto da URL
    const urlParams = new URLSearchParams(window.location.search);
    const produtoId = urlParams.get("id");

    if (!produtoId) {
        alert("Produto não encontrado!");
        window.location.href = "homeProdutos.html";
        return;
    }

    // Faz a requisição para buscar os detalhes do produto
    fetch(`http://localhost:8080/produtos/${produtoId}`)
        .then(response => response.json())
        .then(produto => {
            const produtoDetalhado = document.getElementById("produtoDetalhado");
            produtoDetalhado.innerHTML = "";

            // Cria o card com os detalhes do produto
            const imagemSrc = produto.imagemPadrao
                ? `data:image/jpeg;base64,${arrayBufferToBase64(produto.imagemPadrao)}`
                : "/imagens/placeholder.png";

            produtoDetalhado.innerHTML = `
                <div class="col-md-6">
                    <img src="${imagemSrc}" class="img-fluid" alt="${produto.nome}">
                </div>
                <div class="col-md-6">
                    <h3>${produto.nome}</h3>
                    <p><strong>Descrição:</strong> ${produto.descricao}</p>
                    <p><strong>Avaliação:</strong> ${produto.avaliacao} / 5</p>
                    <p><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
                    <p><strong>Quantidade em Estoque:</strong> ${produto.quantidadeEstoque}</p>
                    <button class="btn btn-success">Comprar</button>
                </div>
            `;
        })
        .catch(error => {
            console.error("Erro ao carregar o produto:", error);
            alert("Erro ao carregar as informações do produto.");
        });
});

// Função para converter o array de bytes em base64
function arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}
