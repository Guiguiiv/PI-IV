document.addEventListener('DOMContentLoaded', () => {
    carregarDadosCliente();
    carregarEnderecos();

    document.getElementById('formDadosCliente').addEventListener('submit', atualizarDadosCliente);
    document.getElementById('formNovoEndereco').addEventListener('submit', adicionarEndereco);

    document.getElementById('cep').addEventListener('blur', buscarCEP);
});

function carregarDadosCliente() {
    fetch('/api/cliente/logado')
        .then(res => res.json())
        .then(cliente => {
            document.getElementById('nome').value = cliente.nome;
            document.getElementById('dataNascimento').value = cliente.dataNascimento;
            document.getElementById('genero').value = cliente.genero;
        });
}

function atualizarDadosCliente(e) {
    e.preventDefault();

    const clienteAtualizado = {
        nome: document.getElementById('nome').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        genero: document.getElementById('genero').value,
        senha: document.getElementById('senha').value
    };

    fetch('/api/cliente/atualizar', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(clienteAtualizado)
    }).then(() => alert('Dados atualizados com sucesso!'));
}

function buscarCEP() {
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    if (cep.length === 8) {
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json())
            .then(endereco => {
                document.getElementById('rua').value = endereco.logradouro || '';
                document.getElementById('bairro').value = endereco.bairro || '';
                document.getElementById('cidade').value = endereco.localidade || '';
                document.getElementById('uf').value = endereco.uf || '';
            });
    }
}

function adicionarEndereco(e) {
    e.preventDefault();

    const endereco = {
        cep: document.getElementById('cep').value,
        rua: document.getElementById('rua').value,
        numero: document.getElementById('numero').value,
        bairro: document.getElementById('bairro').value,
        cidade: document.getElementById('cidade').value,
        uf: document.getElementById('uf').value,
        padrao: document.getElementById('padrao').checked
    };

    fetch('/api/endereco', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(endereco)
    }).then(() => {
        alert('Endereço salvo com sucesso!');
        carregarEnderecos();
        document.getElementById('formNovoEndereco').reset();
    });
}

function carregarEnderecos() {
    fetch('/api/endereco')
        .then(res => res.json())
        .then(enderecos => {
            const lista = document.getElementById('listaEnderecos');
            lista.innerHTML = '';

            enderecos.forEach(endereco => {
                const item = document.createElement('div');
                item.className = 'list-group-item d-flex justify-content-between align-items-center';

                item.innerHTML = `
          <div>
            ${endereco.rua}, ${endereco.numero} - ${endereco.bairro}, ${endereco.cidade} - ${endereco.uf}
            ${endereco.padrao ? '<span class="badge bg-primary ms-2">Padrão</span>' : ''}
          </div>
          ${!endereco.padrao ? `<button class="btn btn-sm btn-outline-primary" onclick="definirEnderecoPadrao(${endereco.id})">Definir como Padrão</button>` : ''}
        `;

                lista.appendChild(item);
            });
        });
}

function definirEnderecoPadrao(id) {
    fetch(`/api/endereco/padrao/${id}`, { method: 'PUT' })
        .then(() => {
            alert('Endereço padrão atualizado!');
            carregarEnderecos();
        });
}
