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

    // Editar (atualizar) endereço existente
    public Endereco editarEndereco(Endereco endereco) {
        return repository.save(endereco);
    }

    // Buscar endereço por ID
    public Optional<Endereco> buscarEnderecoPorId(int id) {
        return repository.findById(id);
    }

    // Buscar todos os endereços de um cliente pelo ID do cliente
    public List<Endereco> buscarEnderecosPorIdCliente(int idCliente) {
        return repository.findByClienteId(idCliente);
    }

    // Buscar todos os endereços principais
    public List<Endereco> buscarEnderecosPrincipais() {
        return repository.findByPrincipalTrue();
    }

    // Deletar um endereço pelo ID
    public boolean deletarEndereco(int id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}
