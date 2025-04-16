document.addEventListener("DOMContentLoaded", function () {
    carregarProdutos();
});

// Função para carregar os produtos na tabela
function carregarProdutos() {
    fetch("http://localhost:8080/produtos")
        .then(response => {
            if (!response.ok) {
                throw new Error("Erro na resposta da API: " + response.statusText);
            }
            return response.json();
        })
        .then(produtos => {
            console.log("Produtos recebidos:", produtos); // Log para depuração
            preencherTabela(produtos);
        })
        .catch(error => console.error("Erro ao buscar produtos:", error));
}

// Função para preencher a tabela com os produtos
function preencherTabela(produtos) {
    let tabela = document.getElementById("tabelaProdutos");
    tabela.innerHTML = "";

    if (produtos.length === 0) {
        tabela.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum produto encontrado.</td></tr>`;
        return;
    }

    produtos.forEach(produto => {
        let statusTexto = produto.ativo ? "Ativo" : "Inativo";
        let novaLinha = `
            <tr>
                <td>${produto.id}</td>
                <td>${produto.nome}</td>
                <td>${produto.quantidadeEstoque}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td>${statusTexto}</td>
                <td class="text-center">
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-info" style="min-width: 100px;" onclick="visualizarProduto(${produto.id})">Visualizar</button>
                        <button class="btn btn-warning" style="min-width: 100px;" onclick="editarProduto(${produto.id})">Editar</button>
                        <button class="btn ${produto.ativo ? 'btn-danger' : 'btn-success'}" style="min-width: 100px;" onclick="alterarStatusProduto(${produto.id}, ${produto.ativo})">
                            ${produto.ativo ? 'Desativar' : 'Ativar'}
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tabela.innerHTML += novaLinha;
    });
}

// Função para visualizar detalhes do produto em um modal
function visualizarProduto(id) {
    fetch(`http://localhost:8080/produtos/${id}`)
        .then(response => response.json())
        .then(produto => {
            // Exibe o nome do produto no modal
            document.getElementById("produtoNomeModal").innerText = produto.nome;
            document.getElementById("produtoQuantidadeModal").innerText = produto.quantidadeEstoque;
            document.getElementById("produtoPrecoModal").innerText = produto.preco.toFixed(2);

            // Exibindo a imagem principal do produto
            const imagemPrincipal = document.getElementById("produtoImagemModal");
            if (produto.imagemPadrao) {
                // Se a imagem principal estiver configurada, exibe-a
                imagemPrincipal.src = `http://localhost:8080/${produto.imagemPadrao}`;
            } else {
                // Caso contrário, exibe uma imagem de placeholder
                imagemPrincipal.src = "https://via.placeholder.com/300?text=Sem+Imagem";
            }

            // Carregar as imagens adicionais no carrossel
            const carouselInner = document.getElementById("carouselInner");
            carouselInner.innerHTML = ""; // Limpa o carrossel anterior

            if (produto.imagensAdicionais && produto.imagensAdicionais.length > 0) {
                produto.imagensAdicionais.forEach((img, index) => {
                    // Cria o item do carrossel
                    let divItem = document.createElement("div");
                    divItem.classList.add("carousel-item");
                    if (img.padrao) divItem.classList.add("active"); // A imagem padrão é a primeira (ativa)

                    // Cria a tag <img> para o carrossel
                    let imgElement = document.createElement("img");
                    imgElement.src = `http://localhost:8080/${img.caminho}`;  // Ajusta o caminho da imagem
                    imgElement.classList.add("d-block", "w-100");
                    imgElement.style.height = "400px";
                    imgElement.style.objectFit = "cover";

                    // Adiciona a imagem ao item do carrossel
                    divItem.appendChild(imgElement);
                    carouselInner.appendChild(divItem);
                });
            } else {
                // Caso não haja imagens adicionais, exibe uma imagem padrão
                carouselInner.innerHTML = "<div class='carousel-item active'><img src='https://via.placeholder.com/300?text=Sem+Imagem' class='d-block w-100'></div>";
            }

            // Exibe o modal
            let modal = new bootstrap.Modal(document.getElementById("modalVisualizarProduto"));
            modal.show();
        })
        .catch(() => alert("Erro ao carregar detalhes do produto."));
}

// Função para confirmar a alteração de status do produto
function alterarStatusProduto(id, statusAtual) {
    let acao = statusAtual ? "desativar" : "ativar";

    if (confirm(`Tem certeza que deseja ${acao} este produto?`)) {
        fetch(`http://localhost:8080/produtos/${id}/ativarDesativar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao alterar status do produto.");
                }
                return response.json();
            })
            .then(produtoAtualizado => {
                alert(`Produto ${produtoAtualizado.ativo ? 'ativado' : 'desativado'} com sucesso!`);
                carregarProdutos();
            })
            .catch(error => {
                console.error("Erro ao alterar status do produto:", error);
                alert("Erro ao alterar o status do produto.");
            });
    }
}

function editarProduto(id) {
    fetch(`http://localhost:8080/produtos/${id}`)
        .then(response => response.json())
        .then(produto => {
            document.getElementById("produtoId").value = produto.id;
            document.getElementById("produtoNome").value = produto.nome;
            document.getElementById("produtoValor").value = produto.preco;
            document.getElementById("produtoQuantidade").value = produto.quantidadeEstoque;
            document.getElementById("produtoDescricao").value = produto.descricao;
            document.getElementById("produtoAvaliacao").value = produto.avaliacao;
            document.getElementById("produtoStatus").value = produto.ativo;

            let modal = new bootstrap.Modal(document.getElementById("modalEditarProduto"));
            modal.show();
        })
        .catch(() => alert("Erro ao carregar os dados do produto."));
}

// Função para salvar alterações do produto
function salvarEdicaoProduto() {
    let id = document.getElementById("produtoId").value;
    let nome = document.getElementById("produtoNome").value;
    let preco = parseFloat(document.getElementById("produtoValor").value);
    let quantidade = parseInt(document.getElementById("produtoQuantidade").value);
    let descricao = document.getElementById("produtoDescricao").value;
    let avaliacao = parseFloat(document.getElementById("produtoAvaliacao").value);
    let status = document.getElementById("produtoStatus").value === "true";

    let produtoAtualizado = {
        id: id,
        nome: nome,
        preco: preco,
        quantidadeEstoque: quantidade,
        descricao: descricao,
        avaliacao: avaliacao,
        ativo: status
    };

    fetch(`http://localhost:8080/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoAtualizado)
    })
        .then(() => {
            alert("Produto atualizado com sucesso!");
            let modal = bootstrap.Modal.getInstance(document.getElementById("modalEditarProduto"));
            modal.hide();
            carregarProdutos();
        })
        .catch(() => alert("Erro ao atualizar o produto."));
}

// Redireciona para a tela de cadastro
function cadastrarProduto() {
    window.location.href = "cadastrarProduto.html";
}
