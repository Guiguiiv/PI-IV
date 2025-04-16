document.addEventListener("DOMContentLoaded", function () {
    const inputImagens = document.getElementById("inputImagens");
    const carouselInner = document.getElementById("carouselInner");
    const imagemPrincipal = document.getElementById("imagemPrincipal");
    let imagensSelecionadas = [];

    // Lida com a seleção de imagens
    inputImagens.addEventListener("change", function () {
        let arquivos = Array.from(this.files);
        if (arquivos.length === 0) return;

        carouselInner.innerHTML = "";
        imagensSelecionadas = arquivos;

        arquivos.forEach((file, index) => {
            let reader = new FileReader();

            reader.onload = function (e) {
                let divItem = document.createElement("div");
                divItem.classList.add("carousel-item");
                if (index === 0) {
                    divItem.classList.add("active");
                    imagemPrincipal.src = e.target.result; // Define a imagem principal
                }

                let img = document.createElement("img");
                img.src = e.target.result;
                img.classList.add("d-block", "w-100");
                img.style.height = "400px";
                img.style.objectFit = "cover";

                divItem.appendChild(img);
                carouselInner.appendChild(divItem);
            };

            reader.readAsDataURL(file);
        });
    });

    // Salvar imagens no modal e atualizar a imagem principal
    // Salvar imagens no modal e atualizar a imagem principal
    window.salvarImagens = function () {
        if (imagensSelecionadas.length > 0) {
            let formData = new FormData();
            formData.append("imagem", imagensSelecionadas[0]); // Adiciona a primeira imagem como principal

            // Se o backend aceitar várias imagens, envie todas
            imagensSelecionadas.forEach((file) => {
                formData.append("imagens", file); // Aqui você pode enviar todas as imagens
            });

            fetch("http://localhost:8080/produtos", {
                method: "POST",
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Erro ao salvar o produto.");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("Produto e imagens salvos com sucesso", data);

                    // Exibe a imagem principal após salvar o produto
                    imagemPrincipal.src = "http://localhost:8080" + data.imagemPrincipal;

                    // Exibe as outras imagens no carrossel
                    const imagensCarrossel = data.imagens.map((imgPath, index) => {
                        let divItem = document.createElement("div");
                        divItem.classList.add("carousel-item");
                        if (index === 0) divItem.classList.add("active");

                        let img = document.createElement("img");
                        img.src = "http://localhost:8080" + imgPath;
                        img.classList.add("d-block", "w-100");
                        img.style.height = "400px";
                        img.style.objectFit = "cover";

                        divItem.appendChild(img);
                        return divItem;
                    });

                    // Limpa o carrossel anterior e adiciona as novas imagens
                    carouselInner.innerHTML = "";
                    imagensCarrossel.forEach(item => carouselInner.appendChild(item));
                })
                .catch(error => console.error("Erro ao salvar o produto:", error));
        }

        let modalEl = document.getElementById("modalImagem");
        let modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
    };


    // Função para salvar o produto
    window.confirmarSalvar = function () {
        let nome = document.getElementById("nome").value.trim();
        let quantidade = document.getElementById("quantidade").value.trim();
        let descricao = document.getElementById("descricao").value.trim();
        let avaliacao = document.getElementById("avaliacao").value.trim();
        let preco = document.getElementById("preco").value.trim().replace(/[^0-9,]/g, "").replace(",", ".");

        if (!nome || !preco || !quantidade || !descricao || !avaliacao) {
            alert("Todos os campos são obrigatórios!");
            return;
        }

        if (isNaN(parseFloat(preco)) || parseFloat(preco) <= 0) {
            alert("O preço deve ser um número positivo.");
            return;
        }

        if (isNaN(parseInt(quantidade)) || parseInt(quantidade) < 0) {
            alert("A quantidade deve ser um número inteiro positivo.");
            return;
        }

        if (isNaN(parseFloat(avaliacao)) || parseFloat(avaliacao) < 1 || parseFloat(avaliacao) > 5) {
            alert("A avaliação deve estar entre 1 e 5.");
            return;
        }

        let formData = new FormData();
        formData.append("nome", nome);
        formData.append("preco", parseFloat(preco));
        formData.append("quantidadeEstoque", parseInt(quantidade));
        formData.append("descricao", descricao);
        formData.append("avaliacao", parseFloat(avaliacao));

        // Adicionar todas as imagens ao FormData
        imagensSelecionadas.forEach((imagem) => {
            formData.append("imagens", imagem);  // Envia todas as imagens
        });

        fetch("http://localhost:8080/produtos", {
            method: "POST",
            body: formData
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao salvar o produto.");
                }
                return response.json();
            })
            .then(() => {
                alert("Produto cadastrado com sucesso!");
                window.location.href = "listarProduto.html";
            })
            .catch(error => console.error("Erro ao cadastrar produto:", error));
    };

    // Formatar o campo de preço em moeda brasileira (R$)
    document.getElementById("preco").addEventListener("input", function () {
        let valor = this.value.replace(/[^0-9]/g, "");
        valor = (parseInt(valor) / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });
        this.value = valor;
    });

    // Impedir valores fora do intervalo no campo de avaliação
    document.getElementById("avaliacao").addEventListener("input", function () {
        let valor = parseFloat(this.value);
        if (valor < 1) this.value = "1";
        if (valor > 5) this.value = "5";
    });
});

// Função para cancelar a operação
window.confirmarCancelamento = function () {
    alert("Operação cancelada.");
};
