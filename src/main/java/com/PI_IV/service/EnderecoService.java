package com.PI_IV.service;

import com.PI_IV.DAO.InterfaceEndereco;
import com.PI_IV.model.Endereco;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnderecoService {

    private final InterfaceEndereco repository;

    // Injeção de dependência via construtor
    public EnderecoService(InterfaceEndereco repository) {
        this.repository = repository;
    }

    // Listar todos os endereços
    public List<Endereco> listarEnderecos() {
        return (List<Endereco>) repository.findAll();
    }

    // Criar um novo endereço
    public Endereco criarEndereco(Endereco endereco) {
        return repository.save(endereco);
    }

    // Editar (atualizar) um endereço existente
    public Endereco editarEndereco(Endereco endereco) {
        return repository.save(endereco);
    }

    // Buscar endereço por ID
    public Optional<Endereco> buscarEnderecoPorId(int id) {
        return repository.findById(id);
    }

    // Buscar todos os endereços de um cliente
    public List<Endereco> buscarEnderecosPorIdCliente(int idCliente) {
        return repository.findByClienteId(idCliente);
    }

    // Buscar todos os endereços marcados como principal
    public List<Endereco> buscarEnderecosPrincipais() {
        return repository.findByPrincipalTrue();
    }

    // Definir um endereço como principal para um cliente
    public boolean definirEnderecoPrincipal(Integer idEndereco) {
        Optional<Endereco> optEndereco = repository.findById(idEndereco);

        if (optEndereco.isPresent()) {
            Endereco enderecoSelecionado = optEndereco.get();
            int idCliente = enderecoSelecionado.getCliente().getId();

            // Buscar todos os endereços do cliente
            List<Endereco> enderecosCliente = repository.findByClienteId(idCliente);

            // Desmarcar todos como principal
            for (Endereco e : enderecosCliente) {
                e.setPrincipal(false);
            }

            // Marcar o endereço selecionado como principal
            enderecoSelecionado.setPrincipal(true);

            // Atualizar todos os endereços
            repository.saveAll(enderecosCliente);

            return true;
        }

        return false;
    }

    // Deletar um endereço
    public boolean deletarEndereco(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
