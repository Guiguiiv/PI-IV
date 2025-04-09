package com.PI_IV.service;

import com.PI_IV.DAO.InterfaceCliente;
import com.PI_IV.model.Cliente;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClienteService {

    private final InterfaceCliente repository;
    private final PasswordEncoder passwordEncoder;

    // Injeção de dependências
    public ClienteService(InterfaceCliente repository) {
        this.repository = repository;
        this.passwordEncoder = new BCryptPasswordEncoder(); // Para criptografar senhas
    }

    // Listar todos os clientes
    public List<Cliente> listarClientes() {
        return (List<Cliente>) repository.findAll();
    }

    // Criar um novo cliente
    public Cliente criarCliente(Cliente cliente) {
        cliente.setSenha(passwordEncoder.encode(cliente.getSenha()));
        return repository.save(cliente);
    }

    // Editar cliente (apenas campos permitidos)
    public Cliente editarCliente(Cliente clienteAtualizado) {
        Optional<Cliente> clienteOpt = repository.findById(clienteAtualizado.getId());

        if (clienteOpt.isPresent()) {
            Cliente cliente = clienteOpt.get();

            cliente.setNome(clienteAtualizado.getNome());
            cliente.setDataNascimento(clienteAtualizado.getDataNascimento());
            cliente.setGenero(clienteAtualizado.getGenero());

            // Atualiza senha se enviada
            if (clienteAtualizado.getSenha() != null && !clienteAtualizado.getSenha().isEmpty()) {
                cliente.setSenha(passwordEncoder.encode(clienteAtualizado.getSenha()));
            }

            return repository.save(cliente);
        }

        return null;
    }

    // Buscar cliente por ID
    public Optional<Cliente> buscarClientePorId(int id) {
        return repository.findById(id);
    }

    // Buscar cliente por CPF
    public Optional<Cliente> buscarClientePorCpf(String cpf) {
        return repository.findByCpf(cpf);
    }

    // Buscar cliente por Email
    public Optional<Cliente> buscarClientePorEmail(String email) {
        return repository.findByEmail(email);
    }
}
