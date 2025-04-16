document.addEventListener("DOMContentLoaded", function () {
    // Carregar produtos da API
    carregarProdutos();

    function carregarProdutos() {
        fetch("http://localhost:8080/produtos")
            .then(response => response.json())
            .then(produtos => {
                let listaProdutos = document.getElementById("listaProdutos");
                listaProdutos.innerHTML = "";

                produtos.forEach(produto => {
                    console.log(produto.imagemPadrao);
                    let imagemSrc = produto.imagemPadrao
                        ? `http://localhost:8080/${produto.imagemPadrao}`
                        : "http://localhost:8080/imagens_produto/placeholder.png";

                    listaProdutos.innerHTML += `
                        <div class="col">
                            <div class="card h-100">
                                <img src="${imagemSrc}" class="card-img-top" alt="${produto.nome}">
                                <div class="card-body">
                                    <h5 class="card-title">${produto.nome}</h5>
                                    <p class="card-text">R$ ${produto.preco.toFixed(2)}</p>
                                    <button class="btn btn-info" onclick="visualizarProduto(${produto.id})">Visualizar</button>
                                </div>
                            </div>
                        </div>
                    `;
                });
            })
            .catch(error => {
                console.error("Erro ao carregar os produtos:", error);
            });
    }

    window.visualizarProduto = function (id) {
        fetch(`http://localhost:8080/produtos/${id}`)
            .then(response => response.json())
            .then(produto => {
                document.getElementById("produtoNomeModal").innerText = produto.nome;
                document.getElementById("produtoQuantidadeModal").innerText = produto.quantidadeEstoque;
                document.getElementById("produtoPrecoModal").innerText = `R$ ${produto.preco.toFixed(2)}`;

                // Exibir a imagem principal do produto
                if (produto.imagemPadrao) {
                    document.getElementById("produtoImagemModal").src = `http://localhost:8080/${produto.imagemPadrao}`;
                } else {
                    document.getElementById("produtoImagemModal").src = "https://via.placeholder.com/300?text=Sem+Imagem";
                }

                // Adicionar imagens adicionais no carrossel do modal
                let carrosselImagens = document.getElementById("carrosselImagens");
                carrosselImagens.innerHTML = "";

                if (produto.imagensAdicionais && produto.imagensAdicionais.length > 0) {
                    produto.imagensAdicionais.forEach((imagem, index) => {
                        let imagemElement = document.createElement("div");
                        imagemElement.classList.add("carousel-item");
                        if (index === 0) {
                            imagemElement.classList.add("active");
                        }
                        imagemElement.innerHTML = `
                        <img src="http://localhost:8080/${imagem.caminho}" class="d-block w-100" alt="${imagem.nome}">
                    `;
                        carrosselImagens.appendChild(imagemElement);
                    });
                }

                // Botão para comprar
                let botaoComprar = document.querySelector("#modalVisualizarProduto .btn-success");
                botaoComprar.onclick = function () {
                    adicionarAoCarrinho({
                        id: produto.id,
                        nome: produto.nome,
                        preco: produto.preco,
                        imagem: document.getElementById("produtoImagemModal").src
                    });
                };

                // Exibe o modal
                let modal = new bootstrap.Modal(document.getElementById("modalVisualizarProduto"));
                modal.show();
            })
            .catch(error => {
                console.error("Erro ao carregar os detalhes do produto:", error);
                alert("Erro ao carregar os detalhes do produto.");
            });
    };

    // Inicializa o carrinho no localStorage
    if (!localStorage.getItem("carrinho")) {
        localStorage.setItem("carrinho", JSON.stringify([]));
    }

    function adicionarAoCarrinho(produto) {
        let carrinho = JSON.parse(localStorage.getItem("carrinho"));

        let produtoExistente = carrinho.find(item => item.id === produto.id);
        if (produtoExistente) {
            produtoExistente.quantidade += 1;
        } else {
            produto.quantidade = 1;
            carrinho.push(produto);
        }

        localStorage.setItem("carrinho", JSON.stringify(carrinho));
        alert("Produto adicionado ao carrinho!");
    }
});
