document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCadastro");

    // Recuperar cliente do localStorage
    const clienteLogado = JSON.parse(localStorage.getItem("clienteLogado"));

    if (!clienteLogado) {
        alert("Nenhum cliente logado encontrado.");
        window.location.href = "loginCliente.html";
        return;
    }

    // Preenche os campos com os dados do cliente
    document.getElementById("nome").value = clienteLogado.nome;
    document.getElementById("genero").value = clienteLogado.genero;
    const dataNasc = new Date(clienteLogado.dataNascimento);
    const dataFormatada = dataNasc.toLocaleDateString("pt-BR");
    document.getElementById("dataNascimento").value = dataFormatada;

    // Máscara para data
    document.getElementById("dataNascimento").addEventListener("input", (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length > 2) valor = valor.replace(/^(\d{2})(\d)/, "$1/$2");
        if (valor.length > 5) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");
        if (valor.length > 10) valor = valor.slice(0, 10);
        e.target.value = valor;
    });

    // Validação de senha
    document.getElementById("confirmaSenha").addEventListener("input", () => {
        const senha = document.getElementById("senha").value;
        const confirmaSenha = document.getElementById("confirmaSenha").value;
        const erroSenha = document.getElementById("senhaErro");

        if (senha !== confirmaSenha) {
            erroSenha.classList.remove("d-none");
        } else {
            erroSenha.classList.add("d-none");
        }
    });

    // Submissão do formulário
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = document.getElementById("nome").value.trim();
        const genero = document.getElementById("genero").value;
        const senha = document.getElementById("senha").value;
        const confirmaSenha = document.getElementById("confirmaSenha").value;
        let dataNascimento = document.getElementById("dataNascimento").value;

        // Validações
        const nomeValido = nome.split(" ").filter(p => p.length >= 3);
        if (nomeValido.length < 2) {
            alert("Informe nome completo com no mínimo 2 palavras de 3 letras.");
            return;
        }

        if (senha !== confirmaSenha) {
            document.getElementById("senhaErro").classList.remove("d-none");
            return;
        }

        const partes = dataNascimento.split('/');
        if (partes.length !== 3) {
            alert("Formato de data inválido. Use dd/mm/aaaa.");
            return;
        }
        dataNascimento = `${partes[2]}-${partes[1]}-${partes[0]}`;

        const clienteAtualizado = {
            id: clienteLogado.id,
            nome,
            genero,
            dataNascimento,
            email: clienteLogado.email, // mantém o mesmo email
            senha
        };

        try {
            const resposta = await fetch(`http://localhost:8080/cliente/${clienteLogado.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(clienteAtualizado)
            });

            if (resposta.ok) {
                alert("Dados atualizados com sucesso!");

                // Atualiza localStorage com novos dados
                const clienteAtualizadoResposta = await resposta.json();
                localStorage.setItem("clienteLogado", JSON.stringify(clienteAtualizadoResposta));

                window.location.href = "sessaoEndereco.html";

            } else {
                const erro = await resposta.text();
                alert("Erro ao atualizar: " + erro);
            }
        } catch (erro) {
            console.error("Erro:", erro);
            alert("Erro de conexão com o servidor.");
        }
    });
});
