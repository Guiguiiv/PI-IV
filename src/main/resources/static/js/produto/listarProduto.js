// 🚀 Quando a página terminar de carregar, iniciar funcionalidades principais
document.addEventListener("DOMContentLoaded", function () {
    carregarProdutos(); // Carregar e mostrar todos os produtos da API

    // 🧠 Detectar quando o usuário começar a digitar no campo de busca
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", buscarProduto);
});

// 📥 Buscar todos os produtos do backend e exibir na tabela
function carregarProdutos() {
    fetch("http://localhost:8080/produtos")
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar os produtos.");
            return response.json();
        })
        .then(produtos => {
            preencherTabela(produtos); // Mostrar os produtos na tabela
        })
        .catch(error => console.error("Erro ao carregar produtos:", error));
}

// 🔎 Procurar produto conforme texto digitado no campo de busca
function buscarProduto() {
    const termoBusca = document.getElementById("searchInput").value.trim().toLowerCase();

    // Se o campo estiver vazio, recarregar todos os produtos
    if (termoBusca.length < 1) {
        carregarProdutos();
        return;
    }

    // Buscar todos os produtos e filtrar pelo termo digitado
    fetch("http://localhost:8080/produtos")
        .then(response => {
            if (!response.ok) throw new Error("Erro ao buscar os produtos.");
            return response.json();
        })
        .then(produtos => {
            // Filtrar produtos que combinam com o nome ou ID
            const filtrados = produtos.filter(produto => {
                return produto.id.toString() === termoBusca || produto.nome.toLowerCase().includes(termoBusca);
            });

            preencherTabela(filtrados); // Mostrar somente os produtos filtrados
        })
        .catch(error => console.error("Erro ao filtrar produtos:", error));
}

// 🖨️ Exibir os produtos recebidos na tabela da tela
function preencherTabela(produtos) {
    let tabela = document.getElementById("tabelaProdutos");
    tabela.innerHTML = ""; // Limpar conteúdo atual da tabela

    // Se nenhum produto encontrado, mostrar aviso
    if (produtos.length === 0) {
        tabela.innerHTML = `<tr><td colspan="6" class="text-center">Nenhum produto encontrado.</td></tr>`;
        return;
    }

    // Para cada produto, adicionar uma linha na tabela
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
                <button class="btn btn-info" style="width: 100px;" onclick="visualizarProduto(${produto.id})">Visualizar</button>
                <button class="btn btn-warning" style="width: 100px;" onclick="editarProduto(${produto.id})">Editar</button>
                <button class="btn ${produto.ativo ? 'btn-danger' : 'btn-success'}" style="width: 100px;" onclick="alterarStatusProduto(${produto.id}, ${produto.ativo})">
                    ${produto.ativo ? 'Desativar' : 'Ativar'}
                </button>
            </div>
        </td>
    </tr>
`;

        tabela.innerHTML += novaLinha;
    });
}

// 👁️ Abrir modal com detalhes do produto selecionado
function visualizarProduto(id) {
    fetch(`http://localhost:8080/produtos/${id}`)
        .then(response => response.json())
        .then(produto => {
            // Preencher o modal com informações do produto
            document.getElementById("produtoNomeModal").innerText = produto.nome;
            document.getElementById("produtoQuantidadeModal").innerText = produto.quantidadeEstoque;
            document.getElementById("produtoPrecoModal").innerText = produto.preco.toFixed(2);

            // Mostrar as estrelas de avaliação
            const estrelas = "★".repeat(produto.avaliacao) + "☆".repeat(5 - produto.avaliacao);
            document.getElementById("produtoAvaliacaoEstrelas").innerText = estrelas;

            // Mostrar imagem principal do produto
            const imagem = document.getElementById("produtoImagemModal");
            imagem.src = produto.imagemPadrao
                ? `http://localhost:8080/${produto.imagemPadrao}`
                : "https://via.placeholder.com/300?text=Sem+Imagem";

            // Montar carrossel com imagens adicionais
            const carousel = document.getElementById("carouselInner");
            carousel.innerHTML = "";

            if (produto.imagensAdicionais?.length > 0) {
                produto.imagensAdicionais.forEach((img, index) => {
                    let divItem = document.createElement("div");
                    divItem.classList.add("carousel-item");
                    if (img.padrao) divItem.classList.add("active");

                    let imgElement = document.createElement("img");
                    imgElement.src = `http://localhost:8080/${img.caminho}`;
                    imgElement.classList.add("d-block", "w-100");
                    imgElement.style.height = "400px";
                    imgElement.style.objectFit = "cover";

                    divItem.appendChild(imgElement);
                    carousel.appendChild(divItem);
                });
            } else {
                // Se não houver imagens, mostrar imagem padrão
                carousel.innerHTML = "<div class='carousel-item active'><img src='https://via.placeholder.com/300?text=Sem+Imagem' class='d-block w-100'></div>";
            }

            // Abrir o modal com os detalhes
            new bootstrap.Modal(document.getElementById("modalVisualizarProduto")).show();
        })
        .catch(() => alert("Erro ao mostrar os detalhes do produto."));
}

// 📝 Abrir modal com formulário para editar o produto
function editarProduto(id) {
    fetch(`http://localhost:8080/produtos/${id}`)
        .then(response => response.json())
        .then(produto => {
            // Preencher o formulário com os dados atuais do produto
            document.getElementById("produtoId").value = produto.id;
            document.getElementById("produtoNome").value = produto.nome;
            document.getElementById("produtoValor").value = produto.preco;
            document.getElementById("produtoQuantidade").value = produto.quantidadeEstoque;
            document.getElementById("produtoDescricao").value = produto.descricao;
            document.getElementById("produtoAvaliacao").value = produto.avaliacao;
            document.getElementById("produtoStatus").value = produto.ativo;

            // Exibir o modal de edição
            new bootstrap.Modal(document.getElementById("modalEditarProduto")).show();
        })
        .catch(() => alert("Erro ao carregar os dados do produto."));
}

// 💾 Salvar alterações feitas no produto
function salvarEdicaoProduto() {
    let id = document.getElementById("produtoId").value;
    let nome = document.getElementById("produtoNome").value;
    let preco = parseFloat(document.getElementById("produtoValor").value);
    let quantidade = parseInt(document.getElementById("produtoQuantidade").value);
    let descricao = document.getElementById("produtoDescricao").value;
    let avaliacao = parseFloat(document.getElementById("produtoAvaliacao").value);
    let status = document.getElementById("produtoStatus").value === "true";

    let produtoAtualizado = {
        id, nome, preco, quantidadeEstoque: quantidade, descricao, avaliacao, ativo: status
    };

    fetch(`http://localhost:8080/produtos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produtoAtualizado)
    })
        .then(() => {
            alert("Produto atualizado com sucesso!");
            carregarProdutos(); // Atualizar lista após edição
        })
        .catch(() => alert("Erro ao salvar o produto."));
}

// 🔄 Ativar ou desativar um produto, conforme status atual
function alterarStatusProduto(id, statusAtual) {
    let acao = statusAtual ? "desativar" : "ativar";

    if (confirm(`Tem certeza que quer ${acao} este produto?`)) {
        fetch(`http://localhost:8080/produtos/${id}/ativarDesativar`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                if (!response.ok) throw new Error();
                return response.json();
            })
            .then(produto => {
                alert(`Produto ${produto.ativo ? 'ativado' : 'desativado'} com sucesso!`);
                carregarProdutos(); // Atualizar tabela
            })
            .catch(() => alert("Erro ao mudar o status do produto."));
    }
}
