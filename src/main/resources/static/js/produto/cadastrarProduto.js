document.addEventListener("DOMContentLoaded", function () {
    const inputImagens = document.getElementById("inputImagens");
    const carouselInner = document.getElementById("carouselInner");
    const imagemPrincipal = document.getElementById("imagemPrincipal");
    let imagensSelecionadas = [];

    // Lida com a seleção de imagens e pré-visualização
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

    // Função para salvar o produto (agora inclui o envio das imagens)
    window.confirmarSalvar = function () { // Tornando a função global
        const nome = document.getElementById("nome").value;
        // Pegar o valor do preço SEM formatação para enviar
        const precoInput = document.getElementById("preco").value;
        const precoLimpo = precoInput.replace(/[^0-9]/g, ''); // Remove caracteres não numéricos
        const precoValue = parseFloat(precoLimpo) / 100; // Converte para número

        const quantidade = document.getElementById("quantidade").value;
        const descricao = document.getElementById("descricao").value;
        const avaliacao = document.getElementById("avaliacao").value;

        const formData = new FormData();

        // Adiciona dados do produto
        formData.append("nome", nome);
        formData.append("preco", precoValue); // Envia o valor numérico
        formData.append("quantidadeEstoque", quantidade);
        formData.append("descricao", descricao);
        formData.append("avaliacao", avaliacao);

        // Adiciona as imagens selecionadas ao formData
        imagensSelecionadas.forEach((img) => {
            formData.append("imagens", img);
        });

        fetch("http://localhost:8080/produtos", {
            method: "POST",
            body: formData,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Erro ao salvar o produto.");
                }
                return response.json();
            })
            .then((data) => {
                alert("Produto cadastrado com sucesso!");
            })
            .catch((error) => {
                console.error("Erro ao salvar o produto:", error);
                alert("Erro ao salvar o produto. Verifique os dados e tente novamente.");
            });
    }


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

    // Função para cancelar a operação
    window.confirmarCancelamento = function () {
        alert("Operação cancelada.");
    };

    // Esconde o modal de imagem ao clicar em "Salvar Imagens" (agora desativado)
    window.salvarImagens = function () {
        // Esta função não fará mais a requisição POST separada.
        // A lógica de salvar as imagens foi integrada em confirmarSalvar().
        let modalEl = document.getElementById("modalImagem");
        let modalInstance = bootstrap.Modal.getInstance(modalEl);
        if (modalInstance) {
            modalInstance.hide();
        }
    };
});